import mongoose, { Schema, Document, Model } from 'mongoose';
export interface MongooseValidationError extends Error {
    errors: { [key: string]: any };
}
export interface IProduct extends Document {
    name: string;
    details: {
        price: number;
        description: string;
        color: string;
    };
    stock: number;
    createdAt: Date;
}

const productSchema: Schema<IProduct> = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    details: {
        price: {
            type: Number,
            required: true,
            min: 0
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 10000
        },
        color: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50
        },
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    createdAt: { type: Date, default: Date.now },
});

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
