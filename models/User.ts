import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "@/interfaces";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        required: true,
        default: 'client',
        enum: {
            values: ['client', 'admin'],
            message: '{VALUE} No es un role válido',
        }
    }
}, {
    timestamps: true
});

const userModel: Model<IUser> = mongoose.models.User || mongoose.model('User', userSchema);

export default userModel;
