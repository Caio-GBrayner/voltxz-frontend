/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/owner/my-investments/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OwnerDashboardNavbar } from '@/components/app/lands/OwnerDashboardNavbar';
import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard';
import { investmentService } from '@/services/investmentsService';

export default function MyInvestmentsOverviewPage() {
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [acceptedCount, setAcceptedCount] = useState<number | null>(null);
  const [rejectedCount, setRejectedCount] = useState<number | null>(null);

  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingAccepted, setLoadingAccepted] = useState(true);
  const [loadingRejected, setLoadingRejected] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoadingPending(true);
      try {
        const investments = await investmentService.getMyInvestmentsPending();
        setPendingCount(investments.length);
      } catch (error: any) {
        toast.error(`Erro ao carregar contagem de investimentos pendentes: ${error.message}`);
        setPendingCount(0);
      } finally {
        setLoadingPending(false);
      }

      setLoadingAccepted(true);
      try {
        const investments = await investmentService.getMyInvestmentsAccepted();
        setAcceptedCount(investments.length);
      } catch (error: any) {
        toast.error(`Erro ao carregar contagem de investimentos aceitos: ${error.message}`);
        setAcceptedCount(0);
      } finally {
        setLoadingAccepted(false);
      }

      setLoadingRejected(true);
      try {
        const investments = await investmentService.getMyInvestmentsRejected();
        setRejectedCount(investments.length);
      } catch (error: any) {
        toast.error(`Erro ao carregar contagem de investimentos rejeitados: ${error.message}`);
        setRejectedCount(0);
      } finally {
        setLoadingRejected(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <OwnerDashboardNavbar />
      <main className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Visão Geral dos Investimentos</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardMetricCard
            title="Investimentos Pendentes"
            count={pendingCount !== null ? pendingCount : '...'}
            linkHref="/dashboard/land-owner/my-investments/pending"
            linkText="Ver Pendentes"
            isLoading={loadingPending}
            className="bg-yellow-600 text-white"
          />

          <DashboardMetricCard
            title="Investimentos Aceitos"
            count={acceptedCount !== null ? acceptedCount : '...'}
            linkHref="/dashboard/land-owner/my-investments/accepted"
            linkText="Ver Aceitos"
            isLoading={loadingAccepted}
            className="bg-green-600 text-white"
          />

          <DashboardMetricCard
            title="Investimentos Rejeitados"
            count={rejectedCount !== null ? rejectedCount : '...'}
            linkHref="/dashboard/land-owner/my-investments/rejected"
            linkText="Ver Rejeitados"
            isLoading={loadingRejected}
            className="bg-red-600 text-white"
          />
        </div>
      </main>
    </div>
  );
}