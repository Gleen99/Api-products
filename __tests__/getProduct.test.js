import { rabbitMQClient } from '../../../rabbitmq';
import Product from '../../models/products/ProductsModels';
import { getProduct } from '../controllers/getProduct';

jest.mock('../../models/products/ProductsModels');
jest.mock('../../../rabbitmq');

describe('getProduct', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: 'testProductId' },
            ip: '127.0.0.1',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should return 404 if product is not found', async () => {
        Product.findById.mockResolvedValue(null);

        await getProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' });
    });

    it('should return the product with status and publish a message', async () => {
        const product = { _id: 'testProductId', stock: 5, toObject: jest.fn().mockReturnValue({ _id: 'testProductId', stock: 5 }) };
        Product.findById.mockResolvedValue(product);
        rabbitMQClient.publishMessage.mockResolvedValue();

        await getProduct(req, res);

        expect(Product.findById).toHaveBeenCalledWith('testProductId');
        expect(rabbitMQClient.publishMessage).toHaveBeenCalledWith('produit_consulte', expect.any(String));
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ _id: 'testProductId', stock: 5, status: 'stock_faible' });
    });

    it('should handle errors', async () => {
        const error = new Error('Test Error');
        Product.findById.mockRejectedValue(error);

        await getProduct(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur', error: 'Test Error' });
    });
});
