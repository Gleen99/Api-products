import { Request, Response } from 'express';
import { deleteProduct } from '../src/controllers/produits/deleteProduct';
import Product from '../src/models/products/ProductsModels';

jest.mock('../src/models/products/ProductsModels');
jest.mock('../src/rabbitmq');

describe('deleteProduct', () => {
  it('should delete a product successfully', async () => {
    const req = { params: { id: 'test-id' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Product.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: 'test-id' });

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produit supprimé avec succès' });
  });

  it('should return 404 if product not found', async () => {
    const req = { params: { id: 'test-id' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

    await deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Produit non trouvé' });
  });
});
