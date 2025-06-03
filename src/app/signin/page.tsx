/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { performLogin } from '@/lib/auth'; // <-- Importa performLogin
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SigninPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = 'VoltzX | Entrar';
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Chama performLogin
      const result = await performLogin(email, password);

      if (result.success && result.user) {
        // Usa user_type (consistente com o backend e User type em lib/auth.ts)
        const user_type = result.user.user_type; 
        
        // Redirecionamento baseado no user_type
        if (user_type === 'land_owner') router.push('/dashboard/land-owner'); // <-- Ajuste aqui
        else if (user_type === 'company') router.push('/dashboard/company'); // <-- Ajuste aqui
        else if (user_type === 'investor') router.push('/dashboard/investor/marketplace'); // <-- Ajuste aqui
        else if (user_type === 'monitor') router.push('/dashboard/monitor'); // <-- Ajuste aqui
        else router.push('/dashboard'); // Redirecionamento padrão caso não caia em nenhum dos anteriores
      } else {
        // result.message já virá do catch em performLogin
        setError(result.message || 'Credenciais inválidas');
      }
    } catch (err: any) { // Captura o erro propagado por performLogin
      setError(err.message || 'Ocorreu um erro durante o login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-yellow-200 via-yellow-100 to-yellow-50 px-4">
      <div className="max-w-lg w-full p-10 bg-white rounded-3xl shadow-lg border border-yellow-300">
        {/* Removi o SVG aqui */}
        <h2 className="text-3xl font-extrabold text-yellow-700 text-center mb-8">Entrar</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 placeholder-yellow-400"
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-yellow-300 focus:border-yellow-500 focus:ring-yellow-400 placeholder-yellow-400"
          />

          {error && (
            <p className="text-red-500 text-center font-medium">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold transition-shadow shadow-md hover:shadow-lg"
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-8 text-center text-gray-600 text-sm">
          Não tem uma conta?{' '}
          <Link
            href="/signup"
            className="font-medium text-yellow-600 hover:text-yellow-500 transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}