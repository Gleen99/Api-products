import { IProduct } from '../models/products/ProductsModels';

// Fonction de validation pour le prix
function isValidPrice(price: any): boolean {
    // Vérifie que le prix est une chaîne qui représente un nombre avec au plus deux décimales
    if (typeof price === 'string' && /^\d+(\.\d{1,2})?$/.test(price)) {
        const numericPrice = parseFloat(price);
        return numericPrice >= 0;
    }
    // Vérifie que le prix est un nombre et qu'il est positif
    if (typeof price === 'number' && price >= 0 && /^\d+(\.\d{1,2})?$/.test(price.toString())) {
        return true;
    }
    return false;
}

// Fonction de validation pour le stock (doit être un entier positif)
function isValidStock(stock: any): boolean {
    // Vérifie que le stock est un entier et qu'il est positif ou zéro
    return Number.isInteger(stock) && stock >= 0;
}

// Fonction de validation du produit
export const validateProduct = (product: Partial<IProduct>): string[] => {
    const errors: string[] = [];

    // Validation du nom
    if (!product.name || product.name.length < 2 || product.name.length > 100) {
        errors.push('Le nom du produit doit contenir entre 2 et 100 caractères');
    }

    // Validation des détails
    if (!product.details || typeof product.details !== 'object') {
        errors.push('Les détails du produit sont requis');
    } else {
        if (product.details) {
            // Validation du prix
            if (!isValidPrice(product.details.price)) {
                errors.push('Le prix doit être un nombre positif avec au plus deux décimales (ex: 738.00)');
            }

            // Validation de la description
            if (!product.details.description || product.details.description.length < 10 || product.details.description.length > 1000) {
                errors.push('La description doit contenir entre 10 et 1000 caractères');
            }

            // Validation de la couleur
            if (!product.details.color || product.details.color.length < 3 || product.details.color.length > 50) {
                errors.push('La couleur doit contenir entre 3 et 50 caractères');
            }
        }
    }

    // Validation du stock
    if (!isValidStock(product.stock)) {
        errors.push('Le stock doit être un entier positif ou zéro');
    }

    return errors;
};
