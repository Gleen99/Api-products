import { Request, Response } from 'express';
import Produit, { IProduit } from '../../models/produits/ProduitsModels';

// Créer un nouveau produit
export const createProduit = async (req: Request, res: Response): Promise<void> => {
    const produitData: Partial<IProduit> = req.body;

    // Vérification de la présence des données requises
    if (!produitData.nom || !produitData.description || !produitData.prix || !produitData.categorie) {
        res.status(400).json({ message: 'Tous les champs requis doivent être fournis' });
        return; // Arrêter l'exécution de la fonction si des données requises sont manquantes
    }

    const produit = new Produit(produitData);

    try {
        const newProduit = await produit.save();
        res.status(201).json(newProduit);
    } catch (err) {
        // Vérification de l'instance de l'erreur pour TypeScript
        if (err instanceof Error) {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Erreur inconnue' });
        }
    }
};
