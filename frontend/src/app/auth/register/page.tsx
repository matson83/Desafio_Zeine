"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {api} from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Erro ao registrar usuário");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80 mx-auto mt-20">
      <input type="text" name="name" placeholder="Nome" onChange={handleChange} className="border p-2" />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2" />
      <input type="password" name="password" placeholder="Senha" onChange={handleChange} className="border p-2" />
      <button type="submit" className="bg-blue-500 text-white p-2">Registrar</button>
    </form>
  );
}
