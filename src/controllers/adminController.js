import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({ id: admin.id, username: admin.username, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch admins" });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent suicide deletion
    if (req.adminId === id) {
      return res.status(400).json({ error: "You cannot delete your own active session." });
    }

    await prisma.admin.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    res.status(200).json({ message: "Admin removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete admin" });
  }
};