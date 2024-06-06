import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduit extends Document {
    nom: string;
    description: string;
    prix: number;
    categorie: string;
}

const produitSchema: Schema<IProduit> = new Schema({
    nom: { type: String, required: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true },
    categorie: { type: String, required: true },
});

const Produit: Model<IProduit> = mongoose.model<IProduit>('Produit', produitSchema);

export default Produit;
