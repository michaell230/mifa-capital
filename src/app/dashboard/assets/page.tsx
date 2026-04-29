"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Properti");
  const [value, setValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAssets = () => {
    fetch("/api/assets")
      .then(res => res.json())
      .then(data => {
        setAssets(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, estimated_value: value })
    });
    setSubmitting(false);
    setIsOpen(false);
    fetchAssets();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Manajemen Aset</h2>
          <p className="text-zinc-400 mt-1">Kelola seluruh aset portofolio Anda.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-500 text-white" />}>
            Tambah Aset
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogHeader>
              <DialogTitle>Tambah Aset Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium text-zinc-300">Nama Aset</label>
                <Input required value={name} onChange={e => setName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" placeholder="Contoh: Rumah Kos" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Kategori</label>
                <select required value={category} onChange={e => setCategory(e.target.value)} className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white">
                  <option>Properti</option>
                  <option>Kendaraan</option>
                  <option>Elektronik</option>
                  <option>Saham/Crypto</option>
                  <option>Lainnya</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Estimasi Nilai (Rp)</label>
                <Input required type="number" value={value} onChange={e => setValue(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white" placeholder="0" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-500">
                {submitting ? "Menyimpan..." : "Simpan Aset"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <div className="rounded-md border border-zinc-800">
          <Table>
            <TableHeader className="bg-zinc-800/50">
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-300">Nama Aset</TableHead>
                <TableHead className="text-zinc-300">Kategori</TableHead>
                <TableHead className="text-zinc-300 text-right">Estimasi Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={3} className="text-center text-zinc-500 py-6">Memuat...</TableCell></TableRow>
              ) : assets.length === 0 ? (
                <TableRow><TableCell colSpan={3} className="text-center text-zinc-500 py-6">Belum ada aset.</TableCell></TableRow>
              ) : (
                assets.map((asset) => (
                  <TableRow key={asset.id} className="border-zinc-800">
                    <TableCell className="font-medium text-white">{asset.name}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-zinc-700">
                        {asset.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-medium text-emerald-500">{formatRupiah(asset.estimated_value)}</TableCell>
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
