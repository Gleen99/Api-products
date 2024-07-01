import { Request, Response } from 'express';
import { rabbitMQClient } from "../../../rabbitmq";
import { isValidObjectId } from 'mongoose';
import Product from "../../models/products/ProductsModels";

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    if (!id || !isValidObjectId(id)) {
        res.status(400).json({ message: 'ID du produit invalide' });
        return;
    }

    try {
        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            res.status(404).json({ message: 'Produit non trouvé' });
            return;
        }

        // Publier un message dans RabbitMQ
        await rabbitMQClient.publishMessage('produit_supprime', JSON.stringify({ id }));

        res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (err) {
        console.error('Error in deleteProduct:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
