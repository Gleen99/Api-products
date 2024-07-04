import { Request, Response } from 'express';
import { updateProduct } from '../src/controllers/produits/updateProduit';
import Product from '../src/models/products/ProductsModels';

jest.mock('../src/models/products/ProductsModels');
jest.mock('../src/rabbitmq', () => ({
  rabbitMQClient: {
    publishMessage: jest.fn().mockResolvedValue(null),
  },
}));

describe('updateProduct', () => {
  it('should update a product successfully', async () => {
    const req = { params: { id: 'test-id' }, body: { name: 'Updated Product' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const productMock = {
      _id: 'test-id',
      name: 'Updated Product',
      toObject: jest.fn().mockReturnValue({
        _id: 'test-id',
        name: 'Updated Product',
      }),
    };

    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(productMock);

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      _id: 'test-id',
      name: 'Updated Product',
    });
  });

  it('should return 404 if product not found', async () => {
    const req = { params: { id: 'test-id' }, body: { name: 'Updated Product' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

    await updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' });
  });
});
