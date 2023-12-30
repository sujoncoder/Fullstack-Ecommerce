import jwt from "jsonwebtoken";


export const createJSONWebToken = (payload, secretKey, expiresIn) => {
    if (typeof payload !== "object" || !payload) {
        throw new Error("payload must be non-empty object")
    };

    if (typeof secretKey !== "string" || secretKey === "") {
        throw new Error("secret key must be non-empty string")
    };

    try {
        const token = jwt.sign(payload, secretKey, { expiresIn });
        return token;
    } catch (error) {
        console.error("failed to sign the JWT:", error)
        throw error;
    }
};