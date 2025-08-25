'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';

type FormData = {
  name: string;
  phone: string;
  email: string;
  photo?: FileList;
};

export default function EditContactPage() {
  const { register, handleSubmit, setValue } = useForm<FormData>();
  const router = useRouter();
  const params = useParams();
  const contactId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await api.get(`/contacts/${contactId}`);
        const data = res.data;
        setValue('name', data.name);
        setValue('phone', data.phone);
        setValue('email', data.email);
        setValue('photo', data.photoUrl);
      } catch (err) {
        setError('Erro ao carregar o contato.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, [contactId, setValue]);

  const onSubmit = async (data: FormData) => {
    const form = new FormData();
    form.append('name', data.name);
    form.append('phone', data.phone);
    form.append('email', data.email);
    if (data.photo?.[0]) form.append('photo', data.photo[0]);

    try {
      await api.patch(`/contacts/${contactId}`, form, { headers: { 'Content-Type': 'multipart/form-data' }});
      router.push('/contacts');
    } catch (err) {
      setError('Erro ao atualizar o contato.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este contato?')) return;
    try {
      await api.delete(`/contacts/${contactId}`);
      router.push('/contacts');
    } catch (err) {
      setError('Erro ao excluir o contato.');
      console.error(err);
    }
  };

  if (loading) return <p className="text-white p-6">Carregando...</p>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Editar contato</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 bg-[#1a1a1a] p-6 rounded-2xl">
          <div>
            <label className="text-sm text-gray-300">Foto</label>
            <input type="file" accept="image/*" {...register('photo')} className="block mt-1"/>
          </div>
          <div>
            <label className="text-sm text-gray-300">Nome</label>
            <input {...register('name')} className="w-full px-3 py-2 rounded bg-black/50 text-white outline-none focus:ring-2 ring-lime-400"/>
          </div>
          <div>
            <label className="text-sm text-gray-300">Telefone</label>
            <input {...register('phone')} className="w-full px-3 py-2 rounded bg-black/50 text-white outline-none focus:ring-2 ring-lime-400"/>
          </div>
          <div>
            <label className="text-sm text-gray-300">E-mail</label>
            <input type="email" {...register('email')} className="w-full px-3 py-2 rounded bg-black/50 text-white outline-none focus:ring-2 ring-lime-400"/>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold">Salvar</button>
            <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold">Excluir</button>
            <button type="button" onClick={()=>router.back()} className="px-4 py-2 rounded-xl bg-white/10 text-white">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
