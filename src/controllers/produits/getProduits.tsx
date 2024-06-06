import { Request, Response } from 'express';
import Produit from '../../models/produits/ProduitsModels';

export const getProduits = async (req: Request, res: Response): Promise<void> => {
    try {
        const produits = await Produit.find();

        // Vérification si la liste de produits est vide
        if (produits.length === 0) {
             res.status(404).json({ message: 'Aucun produit trouvé' });
            return
        }

        res.status(200).json(produits);
    } catch (err) {
        res.status(500).json({ message: (err as Error).message });
    }
};
