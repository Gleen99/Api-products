import express from 'express';
import {getProduits} from "../controllers/produits/getProduits";
import {getProduit} from "../controllers/produits/getProduit";
import {createProduit} from "../controllers/produits/createProduit";
import {updateProduit} from "../controllers/produits/updateProduit";
import {deleteProduit} from "../controllers/produits/deleteProduit";

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Récupérer tous les produits
 *     responses:
 *       200:
 *         description: Liste des produits
 */
router.get('/', getProduits);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Récupérer un produit par son identifiant
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du produit
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', getProduit);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Créer un nouveau produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               categorie:
 *                 type: string
 *             required:
 *               - nom
 *               - description
 *               - prix
 *               - categorie
 *     responses:
 *       201:
 *         description: Produit créé avec succès
 *       400:
 *         description: Données invalides
 */

router.post('/', createProduit);

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Mettre à jour un produit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produit'
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Produit non trouvé
 */
router.put('/:id', updateProduit);

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Supprimer un produit
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant du produit
 *     responses:
 *       200:
 *         description: Produit supprimé avec succès
 *       404:
 *         description: Produit non trouvé
 */
router.delete('/:id', deleteProduit);

export default router;