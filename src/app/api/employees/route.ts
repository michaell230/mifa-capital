import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "OWNER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const employees = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      include: { profile: true },
      orderBy: { created_at: "desc" }
    });

    const formattedEmployees = employees.map(emp => ({
      id: emp.id,
      name: emp.name,
      email: emp.email,
      phone: emp.profile?.phone || "-",
      nik: emp.profile?.nik || "-",
      bank_accounts: emp.profile?.bank_accounts || "-"
    }));

    return NextResponse.json(formattedEmployees);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching employees" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "OWNER") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { name, email, password, phone, nik, bank_accounts } = await req.json();

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        role: "EMPLOYEE",
        profile: {
          create: {
            phone,
            nik,
            bank_accounts
          }
        }
      }
    });

    return NextResponse.json({ message: "Employee created successfully", id: newUser.id }, { status: 201 });
  } catch (error) {
    console.error("Employee Creation Error:", error);
    return NextResponse.json({ message: "Error creating employee" }, { status: 500 });
  }
}
