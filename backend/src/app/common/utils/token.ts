import bcrypt from "bcryptjs";

const generatePasswordHash = async (password: string) => {
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
};

export { generatePasswordHash };
