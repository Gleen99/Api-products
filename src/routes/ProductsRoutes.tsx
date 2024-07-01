import express from 'express';
import {getProducts} from "../controllers/produits/getProducts";
import {createProduct} from "../controllers/produits/createProduct";
import {getProduct} from "../controllers/produits/getProduct";
import {updateProduct} from "../controllers/produits/updateProduit";
import {deleteProduct} from "../controllers/produits/deleteProduct";

const router = express.Router();

router.get('/', getProducts);

router.get('/:id', getProduct);

router.post('/', createProduct);

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

export default router;
