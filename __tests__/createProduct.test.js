import { rabbitMQClient } from '../../../rabbitmq';
import { validateProduct } from '../../Helpers/ValidatorsProducts';
import Product, { MongooseValidationError } from '../../models/products/ProductsModels';
import { createProduct } from '../controllers/createProduct';

jest.mock('../../models/products/ProductsModels');
jest.mock('../../../rabbitmq');
jest.mock('../../Helpers/ValidatorsProducts');

describe('createProduct', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { name: 'New Product', price: 100, stock: 50 },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        validateProduct.mockReturnValue([]);
    });

    it('should return 400 if validation fails', async () => {
        validateProduct.mockReturnValue(['Validation error']);

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Validation failed', errors: ['Validation error'] });
    });

    it('should return 409 if product already exists', async () => {
        Product.findOne.mockResolvedValue({ name: 'Existing Product' });

        await createProduct(req, res);

        expect(Product.findOne).toHaveBeenCalledWith({ name: 'New Product' });
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'Un produit avec ce nom existe déjà' });
    });

    it('should create a new product and publish a message', async () => {
        Product.findOne.mockResolvedValue(null);
        const newProduct = { _id: 'newProductId', name: 'New Product', price: 100, stock: 50 };
        Product.prototype.save = jest.fn().mockResolvedValue(newProduct);
        rabbitMQClient.publishMessage.mockResolvedValue();

        await createProduct(req, res);

        expect(Product.findOne).toHaveBeenCalledWith({ name: 'New Product' });
        expect(Product.prototype.save).toHaveBeenCalled();
        expect(rabbitMQClient.publishMessage).toHaveBeenCalledWith('produit_cree', JSON.stringify(newProduct));
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(newProduct);
    });

    it('should handle validation errors from mongoose', async () => {
        const validationError = new MongooseValidationError('ValidationError', { errors: { name: 'Name is required' } });
        Product.prototype.save.mockRejectedValue(validationError);

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur de validation', errors: { name: 'Name is required' } });
    });

    it('should handle server errors', async () => {
        const error = new Error('Test Error');
        Product.prototype.save.mockRejectedValue(error);

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur', error: 'Test Error' });
    });

    it('should handle unknown server errors', async () => {
        const error = 'Unknown Error';
        Product.prototype.save.mockRejectedValue(error);

        await createProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur inconnue' });
    });
});
