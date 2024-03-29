// send error response
export const errorResponse = (res, { statusCode = 500, message = "Internel server error" }) => {
    return res.status(statusCode).json({
        success: false,
        message: message
    });
};


// send success response
export const successResponse = (res, { statusCode = 200, message = "Success", payload = {} }) => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        payload
    });
};