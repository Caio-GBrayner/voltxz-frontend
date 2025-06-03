/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/land-owner/my-investments/accepted/page.tsx
"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { OwnerDashboardNavbar } from '@/components/app/lands/OwnerDashboardNavbar'; // Adjust path if necessary
import { investmentService, Investment } from '@/services/investmentsService';   // Ensure Investment type is imported
import { Button } from '@/components/ui/button';                                // Adjust path if necessary
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Adjust path if necessary
// import Link from 'next/link'; // Uncomment if you need to link to details

export default function AcceptedInvestmentsPage() {
  const [acceptedInvestments, setAcceptedInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAcceptedInvestments = useCallback(async () => {
    setIsLoading(true);
    try {
      const investments = await investmentService.getMyInvestmentsAccepted();
      setAcceptedInvestments(investments);
    } catch (error: any) {
      toast.error(`Erro ao carregar investimentos aceitos: ${error.message}`);
      setAcceptedInvestments([]); // Clear or handle error state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAcceptedInvestments();
  }, [fetchAcceptedInvestments]);

  if (isLoading && acceptedInvestments.length === 0) { // Show loading only on initial load
    return (
      <div>
        <OwnerDashboardNavbar />
        <main className="container mx-auto px-4 mt-8">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Investimentos Aceitos</h1>
          <p>Carregando investimentos aceitos...</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <OwnerDashboardNavbar />
      <main className="container mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Investimentos Aceitos</h1>
          <Button onClick={fetchAcceptedInvestments} variant="outline" disabled={isLoading}>
            {isLoading ? 'Atualizando...' : 'Atualizar Lista'}
          </Button>
        </div>

        {acceptedInvestments.length === 0 && !isLoading ? (
          <p>Nenhum investimento aceito no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {acceptedInvestments.map((investment) => (
              <Card key={investment.id} className="flex flex-col shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">
                    {investment.project?.title || `ID: ${investment.id.substring(0, 8)}...`}
                  </CardTitle>
                   <p className="text-sm text-gray-600">
                    Projeto para o terreno: {investment.land?.street}, {investment.land?.city}
                  </p>
                </CardHeader>
                <CardContent className="flex-grow space-y-2">
                  <p className="text-sm"><strong>Projeto:</strong> {investment.project?.title || 'Não especificado'}</p>
                  <p className="text-sm"><strong>Potência Estimada:</strong> {investment.project?.power_kw || 'N/A'} kW</p>
                  <p className="text-sm"><strong>Custo do Projeto:</strong> R$ {investment.project?.cost || 'N/A'}</p>
                  <p className="text-sm"><strong>Retorno Estimado:</strong> R$ {investment.project?.estimated_return || 'N/A'}</p>
                  <p className="text-sm"><strong>Data da Aceitação:</strong> {new Date(investment.updated_at).toLocaleDateString()}</p>
                  <p className="text-sm"><strong>Status do Acordo:</strong> <span className="font-semibold text-green-700">{investment.owner_agreed}</span></p>
                </CardContent>
                {/* <CardFooter className="pt-4">
                  <Link href={`/dashboard/land-owner/investments/${investment.id}/details`} passHref>
                     <Button variant="outline">Ver Detalhes</Button>
                  </Link>
                </CardFooter> */}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}