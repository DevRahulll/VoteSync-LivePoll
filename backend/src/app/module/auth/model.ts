import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    fullName: string;
    email: string;
    password: string;
    isVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationTokenExpires?: Date;
    passwordResetToken?: string;
    passwordResetTokenExpires?: Date;
    refreshToken?: string;

    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
    {
        fullName: {
            type: String,
            required: [true, "FullName is required"],
            minLength: 3,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minLength: 5,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        emailVerificationToken: {
            type: String,
        },
        emailVerificationTokenExpires: {
            type: Date,
        },
        passwordResetToken: {
            type: String,
        },
        passwordResetTokenExpires: {
            type: Date,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true },
);

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
