import { Request, Response } from 'express';
import { rabbitMQClient } from "../../../rabbitmq";
import Product from "../../models/products/ProductsModels";

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await Product.find();

        if (products.length === 0) {
            res.status(404).json({ message: 'Aucun produit trouvé' });
            return;
        }

        // Ajouter le statut à chaque produit
        const productsWithStatus = products.map(product => {
            let status = 'disponible';
            if (product.stock === 0) {
                status = 'rupture_de_stock';
            } else if (product.stock < 10) { // Vous pouvez ajuster ce seuil
                status = 'stock_faible';
            }

            return {
                ...product.toObject(),
                status: status
            };
        });

        // Publier un message dans RabbitMQ pour enregistrer l'accès à la liste des products
        await rabbitMQClient.publishMessage('liste_produits_consultee', JSON.stringify({
            timestamp: new Date(),
            userIp: req.ip,
            count: products.length,
            productsStatus: productsWithStatus.map(p => ({ id: p._id, status: p.status }))
        }));

        res.status(200).json(productsWithStatus);
    } catch (err: unknown) {
        console.error('Error in getProducts:', err);
        if (err instanceof Error) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        } else {
            res.status(500).json({ message: 'Erreur serveur inconnue' });
        }
    }
};
