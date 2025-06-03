/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/owner/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OwnerDashboardNavbar } from '@/components/app/lands/OwnerDashboardNavbar';
import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard'; // Importe o novo componente
import { landService } from '@/services/landService';

export default function OwnerDashboardPage() {
  const [landsCount, setLandsCount] = useState<number | null>(null);
  const [proposalsCount, setProposalsCount] = useState<number | null>(null);
  const [investmentsCount, setInvestmentsCount] = useState<number | null>(null);

  const [loadingLandsCount, setLoadingLandsCount] = useState(true);
  const [loadingProposalsCount, setLoadingProposalsCount] = useState(true);
  const [loadingInvestmentsCount, setLoadingInvestmentsCount] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      // Buscar contagem de Terrenos
      setLoadingLandsCount(true);
      try {
        // Use a função do seu service que você adaptou/criou
        const count = await landService.getMyLandsCount();
        setLandsCount(count);
      } catch (error: any) {
        toast.error(`Erro ao carregar terrenos: ${error.message || 'Erro desconhecido'}`);
        setLandsCount(0); // Ou algum valor de erro
      } finally {
        setLoadingLandsCount(false);
      }

      // Buscar contagem de Propostas de Projeto
      setLoadingProposalsCount(true);
      try {
        const count = await landService.getMyProjectProposalsCount();
        setProposalsCount(count);
      } catch (error: any) {
        toast.error(`Erro ao carregar propostas: ${error.message || 'Erro desconhecido'}`);
        setProposalsCount(0);
      } finally {
        setLoadingProposalsCount(false);
      }

      // Buscar contagem de Investimentos
      setLoadingInvestmentsCount(true);
      try {
        const count = await landService.getMyInvestmentsCount();
        setInvestmentsCount(count);
      } catch (error: any) {
        toast.error(`Erro ao carregar investimentos: ${error.message || 'Erro desconhecido'}`);
        setInvestmentsCount(0);
      } finally {
        setLoadingInvestmentsCount(false);
      }
    };

    fetchCounts();
  }, []); // O array vazio garante que isso rode apenas uma vez ao montar o componente

  return (
    <div>
      <OwnerDashboardNavbar />
      <main className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard do Proprietário</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardMetricCard
            title="Meus Terrenos"
            count={landsCount !== null ? landsCount : '...'}
            linkHref="/dashboard/land-owner/my-lands" // A rota para a página de terrenos
            linkText="Ver Terrenos"
            isLoading={loadingLandsCount}
            className="bg-blue-600 text-white" // Exemplo de cor para o card
          />

          <DashboardMetricCard
            title="Minhas Propostas de Projeto"
            count={proposalsCount !== null ? proposalsCount : '...'}
            linkHref="/dashboard/land-owner/my-project-proposals" // A rota para as propostas
            linkText="Ver Propostas"
            isLoading={loadingProposalsCount}
            className="bg-green-600 text-white" // Exemplo de cor para o card
          />

          <DashboardMetricCard
            title="Meus Investimentos"
            count={investmentsCount !== null ? investmentsCount : '...'}
            linkHref="/dashboard/land-owner/my-investments" // A rota para os investimentos
            linkText="Ver Investimentos"
            isLoading={loadingInvestmentsCount}
            className="bg-purple-600 text-white" // Exemplo de cor para o card
          />
        </div>

        {/* Adicione mais seções do dashboard aqui, como gráficos, atividades recentes, etc. */}
      </main>
    </div>
  );
}