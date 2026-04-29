import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const assets = await prisma.asset.findMany({
      where: { user_id: (session.user as any).id },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json(assets);
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, category, estimated_value } = await req.json();

    const asset = await prisma.asset.create({
      data: {
        user_id: (session.user as any).id,
        name,
        category,
        estimated_value: parseFloat(estimated_value)
      }
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
