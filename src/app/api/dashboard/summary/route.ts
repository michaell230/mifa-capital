import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Hitung Total Asset
    const assets = await prisma.asset.findMany({
      where: { user_id: userId }
    });
    const totalAssets = assets.reduce((sum, asset) => sum + asset.estimated_value, 0);

    // Hitung Total Cash (Deposit - Withdraw)
    const transactions = await prisma.transaction.findMany({
      where: { user_id: userId },
      orderBy: { transaction_date: 'desc' }
    });
    
    let totalCash = 0;
    transactions.forEach(tx => {
      if (tx.type === "DEPOSIT") totalCash += tx.amount;
      if (tx.type === "WITHDRAW") totalCash -= tx.amount;
    });

    // Ambil 5 transaksi terbaru
    const recentTransactions = transactions.slice(0, 5);

    return NextResponse.json({
      total_cash: totalCash,
      total_assets: totalAssets,
      recent_transactions: recentTransactions
    });

  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
