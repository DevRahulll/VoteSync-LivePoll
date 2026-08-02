import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const generatePasswordHash = async (password: string) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
};

const comparePasswordHash = async (
    password: string,
    candidatePassword: string,
) => {
    return await bcrypt.compare(password, candidatePassword);
};

const generateToken = (
    payload: object,
    secret: Secret,
    options?: SignOptions,
): string => {
    return jwt.sign(payload, secret, options);
};

const generateAccessAndRefreshToken = (
    payload: object,
): { accessToken: string; refreshToken: string } => {
    const accessSecret: Secret = process.env.JWT_ACCESS_SECRET!;
    const refreshSecret: Secret = process.env.JWT_REFRESH_SECRET!;

    if (!process.env.JWT_ACCESS_EXPIRY && process.env.JWT_REFRESH_EXPIRY) {
        throw new Error("Invalid Environment variables");
    }

    //@ts-ignore
    const accessOptions: SignOptions = {
        expiresIn: process.env.JWT_ACCESS_EXPIRY as SignOptions["expiresIn"],
    };

    //@ts-ignore
    const refreshOptions: SignOptions = {
        expiresIn: process.env.JWT_REFRESH_EXPIRY as SignOptions["expiresIn"],
    };

    const accessToken = generateToken(payload, accessSecret, accessOptions);
    const refreshToken = generateToken(payload, refreshSecret, refreshOptions);

    return {
        accessToken,
        refreshToken,
    };
};

export {
    generatePasswordHash,
    comparePasswordHash,
    generateAccessAndRefreshToken,
};
