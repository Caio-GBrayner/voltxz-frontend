/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/owner/my-project-proposals/pending/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OwnerDashboardNavbar } from '@/components/app/lands/OwnerDashboardNavbar';
import { ProjectProposalsTable } from '@/components/app/project-proposals/ProjectProposalsTable'; // Importe o componente da tabela
import { projectProposalService, ProjectProposal } from '@/services/projectProposalService'; // Importe o serviço e a interface
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PendingProjectProposalsPage() {
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedProposalDetails, setSelectedProposalDetails] = useState<ProjectProposal | null>(null);
  const [loadingProposalDetails, setLoadingProposalDetails] = useState(false);
  const [errorProposalDetails, setErrorProposalDetails] = useState<string | null>(null);

  // Função para buscar as propostas pendentes
  const fetchProposals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Chamando a função específica para propostas pendentes
      const data = await projectProposalService.getMyProjectProposalsPending();
      setProposals(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar propostas pendentes.');
      toast.error(err.message || 'Falha ao carregar propostas pendentes.');
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

  // Função para aceitar ou rejeitar a proposta
  const handleOwnerRespond = async (proposalId: string, action: 'accept' | 'reject') => {
    if (!confirm(`Tem certeza que deseja ${action === 'accept' ? 'ACEITAR' : 'REJEITAR'} esta proposta?`)) {
      return;
    }

    try {
      await projectProposalService.ownerRespondToProposal(proposalId, action);
      toast.success(`Proposta ${action === 'accept' ? 'aceita' : 'rejeitada'} com sucesso!`);
      fetchProposals(); // Recarrega a lista para refletir a mudança
    } catch (err: any) {
      toast.error(err.message || `Erro ao ${action === 'accept' ? 'aceitar' : 'rejeitar'} proposta.`);
    }
  };

  return (
    <div>
      <OwnerDashboardNavbar />
      <main className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Minhas Propostas Pendentes</h1>

        {loading ? (
          <p className="text-center text-gray-600">Carregando propostas...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <ProjectProposalsTable
            title="Propostas Pendentes"
            proposals={proposals}
            onViewDetails={handleViewDetails as (proposal: ProjectProposal) => void}
            onAcceptProposal={(id: string) => handleOwnerRespond(id, 'accept')}
            onRejectProposal={(id: string) => handleOwnerRespond(id, 'reject')}
            showActionsForPending={true} // Mostrar os botões de ação (aceitar/rejeitar)
          />
        )}

        {/* Modal de Detalhes da Proposta */}
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
                    ${selectedProposalDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedProposalDetails.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedProposalDetails.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
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
              {selectedProposalDetails && selectedProposalDetails.status === 'pending' && (
                <>
                  <Button variant="outline" onClick={() => {
                      setIsDetailsModalOpen(false); // Fechar o modal antes de responder
                      handleOwnerRespond(selectedProposalDetails.id, 'accept');
                    }}>
                    Aceitar Proposta
                  </Button>
                  <Button variant="destructive" onClick={() => {
                      setIsDetailsModalOpen(false); // Fechar o modal antes de responder
                      handleOwnerRespond(selectedProposalDetails.id, 'reject');
                    }}>
                    Rejeitar Proposta
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}