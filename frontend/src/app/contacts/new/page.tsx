// app/contacts/new/page.tsx
'use client';
import { useForm } from 'react-hook-form';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

type FormData = { name:string; phone:string; email:string; photo: FileList };

export default function NewContact() {
  const { register, handleSubmit } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const form = new FormData();
    form.append('name', data.name);
    form.append('phone', data.phone);
    form.append('email', data.email);
    if (data.photo?.[0]) form.append('photo', data.photo[0]);
    await api.post('/contacts', form, { headers: { 'Content-Type': 'multipart/form-data' }});
    router.push('/contacts');
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-semibold">Novo contato</h1>
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
              <button type="button" onClick={()=>history.back()} className="px-4 py-2 rounded-xl bg-white/10">Cancelar</button>
            </div>
        </form>
      </div>
    </div>
  );
}
