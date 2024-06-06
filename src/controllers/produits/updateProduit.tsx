import { Request, Response } from 'express';
import Produit from '../../models/produits/ProduitsModels';

// Mettre à jour un produit
export const updateProduit = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // Vérification de la présence de l'ID
    if (!id) {
         res.status(400).json({ message: 'ID du produit requis' });
        return
    }

    try {
        const produit = await Produit.findByIdAndUpdate(id, req.body, { new: true });

        // Vérification si le produit est trouvé et mis à jour
        if (!produit) {
             res.status(404).json({ message: 'Produit non trouvé' });
            return
        }

        res.status(200).json(produit);
    } catch (err) {
        // Vérification de l'instance de l'erreur pour TypeScript
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Erreur inconnue' });
        }
    }
};
