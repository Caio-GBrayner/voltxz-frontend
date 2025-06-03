// src/components/navigation/OwnerDashboardNavbar.tsx
"use client"; // Essencial para componentes que usam hooks como useRouter ou interatividade

import React, { useState } from 'react'; // Importe React se não estiver usando a nova transformação JSX
import { useRouter } from 'next/navigation'; // Para usar o hook useRouter
import { Input as ShadcnInput } from '@/components/ui/input'; // Renomeie para evitar conflito com Input padrão se houver
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react'; // Ícone de busca, certifique-se de ter 'lucide-react' instalado

export function OwnerDashboardNavbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para o menu mobile

  const handleSignOut = () => {
    router.push('/signout');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/dashboard/land-owner" className="font-bold text-xl text-yellow-700">
          VoltzX
        </a>

        {/* Botão para Mobile */}
        <button
          className="md:hidden border-0 focus:outline-none"
          type="button"
          aria-label="Toggle navigation"
          onClick={toggleMobileMenu} // Adiciona o evento de clique
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
          </svg>
        </button>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <a href="/dashboard/owner" className="text-gray-700 hover:text-gray-900">Home</a>
          <div className="relative flex items-center">
            <ShadcnInput
              type="search"
              placeholder="Buscar terrenos..."
              className="pr-10 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sair
          </Button>
        </div>
      </div>

      {/* Menu Mobile (Condicionalmente Renderizado) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pt-2 pb-4 space-y-2 border-t border-gray-200">
          <a href="/dashboard/owner" className="block text-gray-700 hover:text-gray-900">Home</a>
          <div className="relative flex items-center">
            <ShadcnInput
              type="search"
              placeholder="Buscar terrenos..."
              className="pr-10 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm w-full"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full">
            Sair
          </Button>
        </div>
      )}
    </nav>
  );
}