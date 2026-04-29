"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { maskData } from "@/lib/masking";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

export default function EmployeesPage() {
  const { data: session } = useSession();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");
  const [bank, setBank] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = () => {
    fetch("/api/employees")
      .then(res => res.json())
      .then(data => {
        setEmployees(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    if ((session?.user as any)?.role === "OWNER") {
      fetchEmployees();
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, nik, bank_accounts: bank })
    });

    if (res.ok) {
      setIsOpen(false);
      setName(""); setEmail(""); setPassword(""); setPhone(""); setNik(""); setBank("");
      fetchEmployees();
    } else {
      const data = await res.json();
      setError(data.message || "Gagal menambahkan karyawan");
    }
    setSubmitting(false);
  };

  if ((session?.user as any)?.role !== "OWNER") {
    return <div className="text-white">Anda tidak memiliki akses ke halaman ini.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Manajemen Karyawan</h2>
          <p className="text-zinc-400 mt-1">Kelola data dan akun staf perusahaan Anda.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button className="bg-emerald-600 hover:bg-emerald-500 text-white" />}>
            Tambah Karyawan
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrasi Akun Karyawan Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {error && <p className="text-red-500 text-sm bg-red-500/10 p-2 rounded">{error}</p>}
              <div>
                <label className="text-sm font-medium text-zinc-300">Nama Lengkap</label>
                <Input required value={name} onChange={e => setName(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Alamat Email</label>
                <Input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Password Sementara</label>
                <Input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Nomor Telepon</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">NIK</label>
                <Input value={nik} onChange={e => setNik(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-300">Rekening Bank</label>
                <Input value={bank} onChange={e => setBank(e.target.value)} className="bg-zinc-800 border-zinc-700 text-white mt-1" placeholder="BCA - 1234567" />
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-500 mt-4">
                {submitting ? "Memproses..." : "Simpan Karyawan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <div className="flex justify-between items-center p-4 border-b border-zinc-800">
          <h3 className="text-lg font-medium text-white">Daftar Staf</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSensitive(!showSensitive)}
            className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
          >
            {showSensitive ? <><EyeOff className="w-4 h-4 mr-2" /> Sembunyikan Data</> : <><Eye className="w-4 h-4 mr-2" /> Tampilkan Data</>}
          </Button>
        </div>
        <div className="rounded-b-md">
          <Table>
            <TableHeader className="bg-zinc-800/50">
              <TableRow className="border-zinc-800">
                <TableHead className="text-zinc-300">Nama</TableHead>
                <TableHead className="text-zinc-300">Email & Telepon</TableHead>
                <TableHead className="text-zinc-300">NIK</TableHead>
                <TableHead className="text-zinc-300">Rekening</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">Memuat...</TableCell></TableRow>
              ) : employees.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-6">Belum ada karyawan.</TableCell></TableRow>
              ) : (
                employees.map((emp) => (
                  <TableRow key={emp.id} className="border-zinc-800">
                    <TableCell className="font-medium text-white">{emp.name}</TableCell>
                    <TableCell>
                      <div className="text-white">{emp.email}</div>
                      <div className="text-xs text-zinc-500">{emp.phone}</div>
                    </TableCell>
                    <TableCell className="font-mono text-zinc-400">
                      {showSensitive ? emp.nik : maskData(emp.nik)}
                    </TableCell>
                    <TableCell className="font-mono text-zinc-400">
                      {showSensitive ? emp.bank_accounts : maskData(emp.bank_accounts)}
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
