/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/owner/my-project-proposals/rejected/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OwnerDashboardNavbar } from '@/components/app/lands/OwnerDashboardNavbar';
import { ProjectProposalsTable } from '@/components/app/project-proposals/ProjectProposalsTable';
import { projectProposalService, ProjectProposal } from '@/services/projectProposalService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function RejectedProjectProposalsPage() {
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProposalDetails, setSelectedProposalDetails] = useState<ProjectProposal | null>(null);
  const [loadingProposalDetails, setLoadingProposalDetails] = useState(false);
  const [errorProposalDetails, setErrorProposalDetails] = useState<string | null>(null);

  // Função para buscar as propostas rejeitadas
  const fetchProposals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectProposalService.getMyProjectProposalsRejected(); // Chama a função para propostas rejeitadas
      setProposals(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar propostas rejeitadas.');
      toast.error(err.message || 'Falha ao carregar propostas rejeitadas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  // Função para exibir detalhes da proposta em um modal
  const handleViewDetails = async (proposal: ProjectProposal) => {
    setIsDetailsModalOpen(true);
    setSelectedProposalDetails(null);
    setLoadingProposalDetails(true);
    setErrorProposalDetails(null);
    try {
      const details = await projectProposalService.getProjectProposalById(proposal.id);
      setSelectedProposalDetails(details);
    } catch (err: any) {
      setErrorProposalDetails(err.message || 'Erro ao carregar detalhes da proposta.');
      toast.error(err.message || 'Erro ao carregar detalhes da proposta.');
    } finally {
      setLoadingProposalDetails(false);
    }
  };

  return (
    <div>
      <OwnerDashboardNavbar />
      <main className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Minhas Propostas Rejeitadas</h1>

        {loading ? (
          <p className="text-center text-gray-600">Carregando propostas...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <ProjectProposalsTable
            title="Propostas Rejeitadas"
            proposals={proposals}
            onViewDetails={handleViewDetails}
            showActionsForPending={false} // Desabilita os botões de ação para propostas rejeitadas
          />
        )}

        {/* Modal de Detalhes da Proposta (mesmo que o de pendentes, mas sem botões de ação) */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detalhes da Proposta</DialogTitle>
              <DialogDescription>
                Informações completas sobre a proposta de projeto.
              </DialogDescription>
            </DialogHeader>
            {loadingProposalDetails ? (
              <div className="flex items-center justify-center py-4">Carregando detalhes...</div>
            ) : errorProposalDetails ? (
              <p className="text-red-500 text-center py-4">{errorProposalDetails}</p>
            ) : selectedProposalDetails ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">ID da Proposta:</span>
                  <span>{selectedProposalDetails.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${selectedProposalDetails.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedProposalDetails.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedProposalDetails.status === 'REJECTED' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedProposalDetails.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Projeto:</span>
                  <span>{selectedProposalDetails.project?.title || 'N/A'} (ID: {selectedProposalDetails.project?.id.substring(0,8)}...)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Potência (kW):</span>
                  <span>{parseFloat(selectedProposalDetails.project?.power_kw || '0').toFixed(2)} kW</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Custo Estimado:</span>
                  <span>R$ {parseFloat(selectedProposalDetails.project?.cost || '0').toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Retorno Estimado:</span>
                  <span>R$ {parseFloat(selectedProposalDetails.project?.estimated_return || '0').toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Status do Projeto:</span>
                  <span>{selectedProposalDetails.project?.status || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Terreno:</span>
                  <span>{selectedProposalDetails.land?.street || 'N/A'}, {selectedProposalDetails.land?.number || 'N/A'}, {selectedProposalDetails.land?.city || 'N/A'} - {selectedProposalDetails.land?.state || 'N/A'} (ID: {selectedProposalDetails.land?.id.substring(0,8)}...)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Preço do Terreno:</span>
                  <span>R$ {parseFloat(selectedProposalDetails.land?.price || '0').toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Disponibilidade do Terreno:</span>
                  <span>{selectedProposalDetails.land?.availability ? 'Sim' : 'Não'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Criado em:</span>
                  <span>{new Date(selectedProposalDetails.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum detalhe disponível.</p>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}