import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.id, deletedAt: null },
      select: { id: true, username: true, email: true, role: true }
    });

    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.admin = admin;
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: "Access denied" });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    next();
  };
};