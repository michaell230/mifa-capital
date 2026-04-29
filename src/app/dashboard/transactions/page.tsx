"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");

  // Form State
  const [type, setType] = useState("DEPOSIT");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTransactions = () => {
    fetch(`/api/transactions?type=${filter}`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount, note })
    });
    setSubmitting(false);
    setIsOpen(false);
    fetchTransactions();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Arus Kas (Cashflow)</h2>
          <p className="text-zinc-400 mt-1">Catat dan pantau pengeluaran serta pemasukan Anda.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-500 text-white" />}>
            Catat Transaksi
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Catat Transaksi Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-zinc-300">Jenis Transaksi</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="DEPOSIT" checked={type === "DEPOSIT"} onChange={() => setType("DEPOSIT")} />
                    <span className="text-sm text-zinc-300">Pemasukan (Deposit)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="WITHDRAW" checked={type === "WITHDRAW"} onChange={() => setType("WITHDRAW")} />
                    <span className="text-sm text-zinc-300">Pengeluaran (Withdraw)</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Nominal (Rp)</label>
                <Input required type="number" value={amount} onChange={e => setAmount(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" placeholder="0" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Keterangan / Catatan</label>
                <Input required value={note} onChange={e => setNote(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Contoh: Gaji Bulanan" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-500">
                {submitting ? "Menyimpan..." : "Simpan Transaksi"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        {['ALL', 'DEPOSIT', 'WITHDRAW'].map(t => (
          <Button 
            key={t}
            variant="outline" 
            className={`border-zinc-800 ${filter === t ? 'bg-zinc-800 text-white' : 'bg-transparent text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
            onClick={() => setFilter(t)}
          >
            {t === 'ALL' ? 'Semua' : t === 'DEPOSIT' ? 'Pemasukan' : 'Pengeluaran'}
          </Button>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <div className="rounded-md border border-zinc-800">
          <Table>
            <TableHeader className="bg-zinc-800/50">
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-300">Jenis</TableHead>
                <TableHead className="text-zinc-300">Keterangan</TableHead>
                <TableHead className="text-zinc-300">Tanggal</TableHead>
                <TableHead className="text-zinc-300 text-right">Nominal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">Memuat...</TableCell></TableRow>
              ) : transactions.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">Belum ada transaksi.</TableCell></TableRow>
              ) : (
                transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-zinc-800">
                    <TableCell>
                      <div className={`inline-flex p-1.5 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        {tx.type === 'DEPOSIT' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-white">{tx.note}</TableCell>
                    <TableCell className="text-zinc-400">{new Date(tx.transaction_date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className={`text-right font-medium ${tx.type === 'DEPOSIT' ? 'text-emerald-500' : 'text-white'}`}>
                      {tx.type === 'DEPOSIT' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
