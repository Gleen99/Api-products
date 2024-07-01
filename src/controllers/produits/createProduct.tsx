import { Request, Response } from 'express';
import { rabbitMQClient } from "../../../rabbitmq";
import Product, {IProduct, MongooseValidationError} from "../../models/products/ProductsModels";
import { validateProduct } from "../../Helpers/ValidatorsProducts";

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const productData: Partial<IProduct> = req.body;

    // Validate input data
    const validationErrors = validateProduct(productData);
    if (validationErrors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors: validationErrors });
        return;
    }

    try {
        // Vérifier si le produit existe déjà
        const existingProduct = await Product.findOne({ name: productData.name });
        if (existingProduct) {
            res.status(409).json({ message: 'Un produit avec ce nom existe déjà' });
            return;
        }

        const product = new Product(productData);
        const newProduct = await product.save();

        // Publier un message dans RabbitMQ
        await rabbitMQClient.publishMessage('produit_cree', JSON.stringify(newProduct));

        res.status(201).json(newProduct);
    } catch (err) {
        if (err instanceof Error) {
            if (err.name === 'ValidationError' && 'errors' in err) {
                const validationError = err as MongooseValidationError;
                res.status(400).json({ message: 'Erreur de validation', errors: validationError.errors });
            } else {
                res.status(500).json({ message: 'Erreur serveur', error: err.message });
            }
        } else {
            res.status(500).json({ message: 'Erreur serveur inconnue' });
        }


    }
};
