import mongoose from 'mongoose';
//@ts-ignore
import { customAlphabet } from 'nanoid';

export interface ProductInput {
  title: string;
  description: string;
  price: number;
  image: string;
  user: string;
}
export interface ProductDocument extends ProductInput, mongoose.Document {
  productId: string;
  createdAt: Date;
  updatedAt: Date;
}

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);
const productSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, default: () => `product_${nanoid()}` },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  },
);

const ProductModel = mongoose.model<ProductDocument>('Product', productSchema);

export default ProductModel;
