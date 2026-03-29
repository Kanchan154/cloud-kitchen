import mongoose, { Document, Schema } from "mongoose";

export interface IUSer extends Document {
    name: string;
    email: string;
    image: string;
    role: string;
}

const schema: Schema<IUSer> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    role: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model<IUSer>("User", schema);
export default User;
