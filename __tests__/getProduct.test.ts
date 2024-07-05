import { Request, Response } from 'express';
import { getProduct } from '../src/controllers/produits/getProduct';
import Product from '../src/models/products/ProductsModels';

jest.mock('../src/models/products/ProductsModels');
jest.mock('../src/rabbitmq', () => ({
  rabbitMQClient: {
    publishMessage: jest.fn().mockResolvedValue(null),
  },
}));

describe('getProduct', () => {
  it('should retrieve a product successfully', async () => {
    const req = { params: { id: 'test-id' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const productMock = {
      _id: 'test-id',
      name: 'Test Product',
      stock: 20,
      toObject: jest.fn().mockReturnValue({
        _id: 'test-id',
        name: 'Test Product',
        stock: 20,
      }),
    };

    (Product.findById as jest.Mock).mockResolvedValue(productMock);

    await getProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'test-id',
      name: 'Test Product',
      stock: 20,
      status: 'disponible',
    });
  });

  it('should return 404 if product not found', async () => {
    const req = { params: { id: 'test-id' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Product.findById as jest.Mock).mockResolvedValue(null);

    await getProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' });
  });
});
