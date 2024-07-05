import { Request, Response } from 'express';
import { createProduct } from '../src/controllers/produits/createProduct';
import Product from '../src/models/products/ProductsModels';

jest.mock('../src/models/products/ProductsModels');

describe('createProduct', () => {
  it('should create a new product successfully', async () => {
    const req = {
      body: {
        name: 'Test Product',
        details: {
          price: '100',
          description: 'Test Description',
          color: 'blue',
        },
        stock: 10,
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Product.findOne as jest.Mock).mockResolvedValue(null);
    (Product.prototype.save as jest.Mock).mockResolvedValue(req.body);

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(req.body);
  });

  it('should return 400 if validation fails', async () => {
    const req = {
      body: {},
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await createProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
