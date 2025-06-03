/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/owner/my-investments/pending/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { OwnerDashboardNavbar } from '@/components/app/lands/OwnerDashboardNavbar';
import { InvestmentsTable } from '@/components/app/investments/InvestmentsTable'; // Importe o componente da tabela
import { investmentService, Investment } from '@/services/investmentsService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PendingInvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedInvestmentDetails, setSelectedInvestmentDetails] = useState<Investment | null>(null);
  const [loadingInvestmentDetails, setLoadingInvestmentDetails] = useState(false);
  const [errorInvestmentDetails, setErrorInvestmentDetails] = useState<string | null>(null);

  // Função para buscar os investimentos pendentes
  const fetchInvestments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await investmentService.getMyInvestmentsPending();
      setInvestments(data);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar investimentos pendentes.');
      toast.error(err.message || 'Falha ao carregar investimentos pendentes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // Função para exibir detalhes do investimento em um modal
  const handleViewDetails = async (investment: Investment) => {
    setIsDetailsModalOpen(true);
    setSelectedInvestmentDetails(null);
    setLoadingInvestmentDetails(true);
    setErrorInvestmentDetails(null);
    try {
      const details = await investmentService.getInvestmentById(investment.id);
      setSelectedInvestmentDetails(details);
    } catch (err: any) {
      setErrorInvestmentDetails(err.message || 'Erro ao carregar detalhes do investimento.');
      toast.error(err.message || 'Erro ao carregar detalhes do investimento.');
    } finally {
      setLoadingInvestmentDetails(false);
    }
  };

  // Função para aceitar ou rejeitar o investimento
  const handleOwnerRespond = async (investmentId: string, action: 'accept' | 'reject') => {
    if (!confirm(`Tem certeza que deseja ${action === 'accept' ? 'ACEITAR' : 'REJEITAR'} este investimento?`)) {
      return;
    }

    try {
      await investmentService.ownerRespondToInvestment(investmentId, action);
      toast.success(`Investimento ${action === 'accept' ? 'aceito' : 'rejeitado'} com sucesso!`);
      fetchInvestments(); // Recarrega a lista para refletir a mudança
    } catch (err: any) {
      toast.error(err.message || `Erro ao ${action === 'accept' ? 'aceitar' : 'rejeitar'} investimento.`);
    }
  };

  return (
    <div>
      <OwnerDashboardNavbar />
      <main className="container mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Meus Investimentos Pendentes</h1>

        {loading ? (
          <p className="text-center text-gray-600">Carregando investimentos...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <InvestmentsTable
            title="Investimentos Pendentes"
            investments={investments}
            onViewDetails={handleViewDetails as (investment: Investment) => void}
            onAcceptInvestment={(id: string) => handleOwnerRespond(id, 'accept')}
            onRejectInvestment={(id: string) => handleOwnerRespond(id, 'reject')}
            showActionsForPending={true}
          />
        )}

        {/* Modal de Detalhes do Investimento */}
        <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Detalhes do Investimento</DialogTitle>
              <DialogDescription>
                Informações completas sobre o investimento.
              </DialogDescription>
            </DialogHeader>
            {loadingInvestmentDetails ? (
              <div className="flex items-center justify-center py-4">Carregando detalhes...</div>
            ) : errorInvestmentDetails ? (
              <p className="text-red-500 text-center py-4">{errorInvestmentDetails}</p>
            ) : selectedInvestmentDetails ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">ID do Investimento:</span>
                  <span>{selectedInvestmentDetails.id}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${selectedInvestmentDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${selectedInvestmentDetails.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                    ${selectedInvestmentDetails.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {selectedInvestmentDetails.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Projeto:</span>
                  <span>{selectedInvestmentDetails.project?.title || 'N/A'} (ID: {selectedInvestmentDetails.project?.id.substring(0,8)}...)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Investidor:</span>
                  <span>ID: {selectedInvestmentDetails.investor?.id.substring(0,8)}...</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Valor Investido:</span>
                  <span>R$ {parseFloat(selectedInvestmentDetails.value_invested || '0').toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Data do Investimento:</span>
                  <span>{new Date(selectedInvestmentDetails.invested_date).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Aprovação do Dono:</span>
                  <span>{selectedInvestmentDetails.owner_agree}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Aprovação da Empresa:</span>
                  <span>{selectedInvestmentDetails.company_agree}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Status do Projeto:</span>
                  <span>{selectedInvestmentDetails.project?.status || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Terreno:</span>
                  <span>{selectedInvestmentDetails.project?.land?.street || 'N/A'}, {selectedInvestmentDetails.project?.land?.number || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-semibold">Criado em:</span>
                  <span>{new Date(selectedInvestmentDetails.invested_date).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Nenhum detalhe disponível.</p>
            )}
            <DialogFooter>
              <Button onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
              {selectedInvestmentDetails && selectedInvestmentDetails.status === 'pending' && (
                <>
                  <Button variant="outline" onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleOwnerRespond(selectedInvestmentDetails.id, 'accept');
                    }}>
                    Aceitar Investimento
                  </Button>
                  <Button variant="destructive" onClick={() => {
                      setIsDetailsModalOpen(false);
                      handleOwnerRespond(selectedInvestmentDetails.id, 'reject');
                    }}>
                    Rejeitar Investimento
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