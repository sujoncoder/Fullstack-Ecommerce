export const errorResponse = (res, { statusCode = 500, message = "Internel server error" }) => {
    return res.status(statusCode).json({
        success: false,
        message: message
    });
};



export const successResponse = (res, { statusCode = 200, message = "Success", payload = {} }) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        payload
    });
};