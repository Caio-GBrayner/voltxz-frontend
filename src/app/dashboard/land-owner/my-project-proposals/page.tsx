  /* eslint-disable @typescript-eslint/no-explicit-any */
  // src/app/dashboard/owner/my-project-proposals/page.tsx
  "use client";

  import React, { useEffect, useState } from 'react';
  import { toast } from 'sonner';
  import { OwnerDashboardNavbar } from '@/components/app/lands/OwnerDashboardNavbar';
  import { DashboardMetricCard } from '@/components/dashboard/DashboardMetricCard';
  import { projectProposalService } from '@/services/projectProposalService';
  // Remova esta linha:
  // import { AgreementStatus } from 'generated/prisma';

  export default function MyProjectProposalsOverviewPage() {
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
          const proposals = await projectProposalService.getMyProjectProposalsPending();
          setPendingCount(proposals.length);
        } catch (error: any) {
          toast.error(`Erro ao carregar contagem de propostas pendentes: ${error.message}`);
          setPendingCount(0);
        } finally {
          setLoadingPending(false);
        }

        setLoadingAccepted(true);
        try {
          const proposals = await projectProposalService.getMyProjectProposalsAccepted();
          setAcceptedCount(proposals.length);
        } catch (error: any) {
          toast.error(`Erro ao carregar contagem de propostas aceitas: ${error.message}`);
          setAcceptedCount(0);
        } finally {
          setLoadingAccepted(false);
        }

        setLoadingRejected(true);
        try {
          const proposals = await projectProposalService.getMyProjectProposalsRejected();
          setRejectedCount(proposals.length);
        } catch (error: any) {
          toast.error(`Erro ao carregar contagem de propostas rejeitadas: ${error.message}`);
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
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Visão Geral das Propostas de Projeto</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardMetricCard
              title="Propostas Pendentes"
              count={pendingCount !== null ? pendingCount : '...'}
              linkHref="/dashboard/land-owner/my-project-proposals/pending"
              linkText="Ver Pendentes"
              isLoading={loadingPending}
              className="bg-yellow-600 text-white"
            />

            <DashboardMetricCard
              title="Propostas Aceitas"
              count={acceptedCount !== null ? acceptedCount : '...'}
              linkHref="/dashboard/land-owner/my-project-proposals/accepted"
              linkText="Ver Aceitas"
              isLoading={loadingAccepted}
              className="bg-green-600 text-white"
            />

            <DashboardMetricCard
              title="Propostas Rejeitadas"
              count={rejectedCount !== null ? rejectedCount : '...'}
              linkHref="/dashboard/land-owner/my-project-proposals/rejected"
              linkText="Ver Rejeitadas"
              isLoading={loadingRejected}
              className="bg-red-600 text-white"
            />
          </div>
        </main>
      </div>
    );
  }