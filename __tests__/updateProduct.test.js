import { isValidObjectId } from 'mongoose';
import { rabbitMQClient } from '../../../rabbitmq';
import { validateProduct } from '../../Helpers/ValidatorsProducts';
import Product, { MongooseValidationError } from '../../models/products/ProductsModels';
import { updateProduct } from '../controllers/updateProduct';

jest.mock('../../models/products/ProductsModels');
jest.mock('../../../rabbitmq');
jest.mock('mongoose', () => ({
    isValidObjectId: jest.fn(),
}));
jest.mock('../../Helpers/ValidatorsProducts');

describe('updateProduct', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 'testProductId' },
            body: { name: 'Updated Product' },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        isValidObjectId.mockReturnValue(true);
        validateProduct.mockReturnValue([]);
    });

    it('should return 400 if id is invalid', async () => {
        isValidObjectId.mockReturnValue(false);

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'ID du produit invalide' });
    });

    it('should return 400 if validation fails', async () => {
        validateProduct.mockReturnValue(['Validation error']);

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Validation failed', errors: ['Validation error'] });
    });

    it('should return 404 if product is not found', async () => {
        Product.findByIdAndUpdate.mockResolvedValue(null);

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' });
    });

    it('should update the product and publish a message', async () => {
        const updatedProduct = { _id: 'testProductId', name: 'Updated Product' };
        Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);
        rabbitMQClient.publishMessage.mockResolvedValue();

        await updateProduct(req, res);

        expect(Product.findByIdAndUpdate).toHaveBeenCalledWith('testProductId', req.body, { new: true, runValidators: true });
        expect(rabbitMQClient.publishMessage).toHaveBeenCalledWith('produit_mis_a_jour', JSON.stringify(updatedProduct));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should handle mongoose validation errors', async () => {
        const validationError = new MongooseValidationError('ValidationError', { errors: { name: { message: 'Name is required' } } });
        Product.findByIdAndUpdate.mockRejectedValue(validationError);

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur de validation', errors: { name: { message: 'Name is required' } } });
    });

    it('should handle server errors', async () => {
        const error = new Error('Test Error');
        Product.findByIdAndUpdate.mockRejectedValue(error);

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur', error: 'Test Error' });
    });

    it('should handle unknown server errors', async () => {
        const error = 'Unknown Error';
        Product.findByIdAndUpdate.mockRejectedValue(error);

        await updateProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur inconnue' });
    });
});
