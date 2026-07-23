export const apiResponse = {
  success: (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  },
  
  error: (res, message = 'Error', statusCode = 500, details = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(details && { details }),
    });
  },
  
  created: (res, data, message = 'Resource created successfully') => {
    return apiResponse.success(res, data, message, 201);
  },
  
  notFound: (res, message = 'Resource not found') => {
    return apiResponse.error(res, message, 404);
  },
  
  badRequest: (res, message = 'Bad request', details = null) => {
    return apiResponse.error(res, message, 400, details);
  },
  
  unauthorized: (res, message = 'Unauthorized') => {
    return apiResponse.error(res, message, 401);
  },
};