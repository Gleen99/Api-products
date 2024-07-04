import { Request, Response } from 'express';
import { getProducts } from '../src/controllers/produits/getProducts';
import Product from '../src/models/products/ProductsModels';

jest.mock('../src/models/products/ProductsModels');
jest.mock('../src/rabbitmq', () => ({
  rabbitMQClient: {
    publishMessage: jest.fn().mockResolvedValue(null),
  },
}));

describe('getProducts', () => {
  it('should retrieve all products successfully', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const productsMock = [
      { _id: 'test-id-1', name: 'Product 1', stock: 10, toObject: jest.fn().mockReturnValue({ _id: 'test-id-1', name: 'Product 1', stock: 10 }) },
      { _id: 'test-id-2', name: 'Product 2', stock: 0, toObject: jest.fn().mockReturnValue({ _id: 'test-id-2', name: 'Product 2', stock: 0 }) },
    ];

    (Product.find as jest.Mock).mockResolvedValue(productsMock);

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { _id: 'test-id-1', name: 'Product 1', stock: 10, status: 'disponible' },
      { _id: 'test-id-2', name: 'Product 2', stock: 0, status: 'rupture_de_stock' },
    ]);
  });

  it('should return 404 if no products found', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Product.find as jest.Mock).mockResolvedValue([]);

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Aucun produit trouvé' });
  });
});
