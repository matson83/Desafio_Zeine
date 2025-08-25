// lib/auth.ts
import { create } from 'zustand';
type User = { id:number; name:string; email:string } | null;

export const useAuth = create<{
  user: User; setUser: (u:User)=>void; logout: ()=>Promise<void>;
}>(set => ({
  user: null,
  setUser: (u) => set({ user: u }),
  logout: async () => { await fetch(`${process.env.NEXT_PUBLIC_API}/auth/logout`, { method:'POST', credentials:'include' }); set({ user: null }); }
}));
