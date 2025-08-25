// app/contacts/page.tsx
'use client';
import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from "next/navigation";

type Contact = { id:number; name:string; phone:string; email:string; photoUrl?:string };

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [letter, setLetter] = useState<string | undefined>(undefined);
  const router = useRouter();

  const fetchContacts = async (startsWith?: string) => {
    const res = await api.get('/contacts', { params: { startsWith }});
    setContacts(res.data);
  };

  const handleLogout = async () => {
    await api.post("/auth/logout"); 
    router.push("auth/login"); 
  };

  useEffect(() => { fetchContacts(letter); }, [letter]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-5xl mx-auto p-6">
        <header className="flex items-center gap-4">
          <button onClick={handleLogout}>Logout</button>
          <h1 className="text-xl font-semibold">Lista de contatos</h1>
          <div className="ml-auto relative group">
            <Link href="/contacts/new" id="add-contact"
              className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold">
              Adicionar contato
            </Link>
            {/* Tooltip secreto após 7s */}
            <DelayedTooltip targetId="add-contact" delayMs={7000} text="Tá esperando o quê? Boraa moeer!! 🚀" />
          </div>
        </header>

        <div className="mt-6 flex gap-6">
          {/* Barra alfabética */}
          <aside className="flex flex-col gap-1">
            <button onClick={()=>setLetter(undefined)} className={`w-8 h-8 rounded-full ${!letter ? 'bg-lime-400 text-black':'bg-[#1a1a1a]'}`}>*</button>
            {alphabet.map(l => (
              <button key={l} onClick={()=>setLetter(l)}
                className={`w-8 h-8 rounded-full hover:bg-lime-400 hover:text-black ${letter===l?'bg-lime-400 text-black':'bg-[#1a1a1a]'}`}>
                {l}
              </button>
            ))}
          </aside>

          {/* Tabela */}
          <section className="flex-1 bg-[#1a1a1a] rounded-2xl p-4">
            <div className="grid grid-cols-[56px_1fr_180px_1fr_100px] items-center px-2 text-gray-300 text-sm">
              <div></div><div>Nome</div><div>Telefone</div><div>E-mail</div><div></div>
            </div>
            <div className="mt-2 divide-y divide-white/5">
              {contacts.map(c => (
                <div key={c.id} className="grid grid-cols-[56px_1fr_180px_1fr_100px] items-center px-2 py-3">
                  {/* Foto do contato */}
                  <img
                    src={c.photoUrl ? `${c.photoUrl}` : '/avatar.png'}
                    alt={c.name}
                    className="w-10 h-10 rounded-full object-cover bg-black/50"
                  />
                  
                  <div>{c.name}</div>
                  <div className="text-gray-300">{c.phone}</div>
                  <div className="text-gray-300">{c.email}</div>
                  
                  <div className="text-right">
                    <Link className="text-lime-400 hover:underline" href={`/contacts/${c.id}`}>Editar</Link>
                  </div>
                </div>
              ))}
              {!contacts.length && <p className="text-gray-400 p-4">Nenhum contato.</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function DelayedTooltip({ targetId, delayMs, text }:{
  targetId:string; delayMs:number; text:string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    let timer: any;
    const onEnter = () => { timer = setTimeout(()=>setShow(true), delayMs); };
    const onLeave = () => { clearTimeout(timer); setShow(false); };
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mouseenter', onEnter); el.removeEventListener('mouseleave', onLeave); clearTimeout(timer); };
  }, [targetId, delayMs]);

  if (!show) return null;
  return (
    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-sm px-3 py-2 rounded-xl border border-lime-400 shadow">
      {text}
    </div>
  );
}
