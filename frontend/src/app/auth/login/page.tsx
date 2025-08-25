// app/login/page.tsx
'use client';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auths';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres')
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { register, handleSubmit, formState:{errors, isSubmitting} } = useForm<FormData>({ resolver: zodResolver(schema) });
  const router = useRouter();
  const setUser = useAuth(s => s.setUser);

  const onSubmit = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/login', data); 
  setUser(res.data.user);
  router.push('/contacts');
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm p-6 rounded-2xl bg-[#1a1a1a] shadow">
        <h1 className="text-xl mb-4 text-white font-semibold">Entrar</h1>
        <label className="text-sm text-gray-300">E-mail</label>
        <input {...register('email')} className="w-full mb-2 px-3 py-2 rounded bg-black/50 text-white outline-none focus:ring-2 ring-lime-400"/>
        {errors.email && <p className="text-red-400 text-sm">{errors.email.message}</p>}
        <label className="text-sm text-gray-300 mt-2">Senha</label>
        <input type="password" {...register('password')} className="w-full mb-2 px-3 py-2 rounded bg-black/50 text-white outline-none focus:ring-2 ring-lime-400"/>
        {errors.password && <p className="text-red-400 text-sm">{errors.password.message}</p>}
        <button disabled={isSubmitting} className="w-full mt-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:brightness-90">
          {isSubmitting ? 'Entrando...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
