"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight, DollarSign, Wallet } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/summary")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-white">Memuat dashboard...</div>;
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-zinc-400 mt-1">Ringkasan portofolio dan arus kas Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Cash Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatRupiah(data.total_cash)}</div>
            <p className="text-xs text-zinc-500 mt-1">Total Deposit - Total Withdraw</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Assets Value</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{formatRupiah(data.total_assets)}</div>
            <p className="text-xs text-zinc-500 mt-1">Estimasi nilai dari seluruh aset</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-4 mt-8">Recent Transactions</h3>
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <div className="divide-y divide-zinc-800">
            {data.recent_transactions.length === 0 ? (
              <div className="p-6 text-center text-zinc-500">Belum ada transaksi.</div>
            ) : (
              data.recent_transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {tx.type === 'DEPOSIT' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{tx.type === 'DEPOSIT' ? 'Pemasukan' : 'Pengeluaran'}</p>
                      <p className="text-xs text-zinc-400">{tx.note || "-"}</p>
                    </div>
                  </div>
                  <div className={`font-semibold ${tx.type === 'DEPOSIT' ? 'text-emerald-500' : 'text-white'}`}>
                    {tx.type === 'DEPOSIT' ? '+' : '-'}{formatRupiah(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
