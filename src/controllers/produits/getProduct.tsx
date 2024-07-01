import { Request, Response } from 'express';
import Product from "../../models/products/ProductsModels";
import {rabbitMQClient} from "../../../rabbitmq";

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);

        if (!product) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }

        // Vérifier le stock et ajouter un statut
        let status = 'disponible';
        if (product.stock === 0) {
            status = 'rupture_de_stock';
        } else if (product.stock < 10) { // Vous pouvez ajuster ce seuil
            status = 'stock_faible';
        }

        // Ajouter le statut à la réponse
        const productWithStatus = {
            ...product.toObject(),
            status: status
        };

        // Publier un message dans RabbitMQ pour enregistrer l'accès
        await rabbitMQClient.publishMessage('produit_consulte', JSON.stringify({
            id: product._id,
            timestamp: new Date(),
            userIp: req.ip,
            status: status
        }));

        res.status(200).json(productWithStatus);
    } catch (err) {
        console.error('Error in getProduct:', err);
        if (err instanceof Error) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        } else {
            res.status(500).json({ message: 'Erreur serveur inconnue' });
        }
    }
};
