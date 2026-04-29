import { NextResponse } from "next-auth/next"; // wait Next13+ has NextResponse from next/server
import { NextResponse as Response } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return Response.json({ message: "Semua kolom wajib diisi" }, { status: 400 });
    }

    if (password.length < 8) {
      return Response.json({ message: "Password minimal 8 karakter" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password_hash,
        profile: {
          create: {
            full_name: name,
          }
        }
      },
    });

    return Response.json({ message: "Registrasi berhasil", user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
