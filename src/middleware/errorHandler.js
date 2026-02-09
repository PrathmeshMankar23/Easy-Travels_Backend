export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma specific errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: "Unique constraint violation",
      message: "A record with this value already exists"
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      error: "Record not found",
      message: "The requested resource was not found"
    });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      error: "Foreign key constraint violation",
      message: "Invalid reference to another record"
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: "Invalid token",
      message: "Authentication failed"
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: "Token expired",
      message: "Please login again"
    });
  }

  // Validation errors
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({
      error: "Validation failed",
      errors: err.errors
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    error: statusCode >= 500 ? "Server error" : "Client error",
    message: process.env.NODE_ENV === 'production' && statusCode >= 500 
      ? "Something went wrong" 
      : message
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`
  });
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
