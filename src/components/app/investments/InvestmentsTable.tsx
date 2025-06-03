// src/components/tables/InvestmentsTable.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Investment } from '@/services/investmentsService'; // Importe a interface Investment

interface InvestmentsTableProps {
  title: string;
  investments: Investment[];
  onViewDetails: (investment: Investment) => void;
  onAcceptInvestment?: (investmentId: string) => void;
  onRejectInvestment?: (investmentId: string) => void;
  showActionsForPending: boolean;
}

export function InvestmentsTable({
  title,
  investments,
  onViewDetails,
  onAcceptInvestment,
  onRejectInvestment,
  showActionsForPending,
}: InvestmentsTableProps) {
  return (
    <div className="rounded-md border">
      <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">{title}</h2>
      {investments.length === 0 ? (
        <p className="p-4 text-center text-gray-500">Nenhum investimento {title.toLowerCase().replace('investimentos ', '')} encontrado.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Valor Investido</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aprovação</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell className="font-medium">
                  {investment.project?.title || 'N/A'}
                </TableCell>
                <TableCell>
                  R$ {parseFloat(investment.value_invested).toFixed(2)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${investment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${investment.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                      ${investment.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}
                  >
                    {investment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs">
                      Dono: {investment.owner_agree}
                    </span>
                    <span className="text-xs">
                      Empresa: {investment.company_agree}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(investment.invested_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewDetails(investment)}
                  >
                    Ver Detalhes
                  </Button>
                  {showActionsForPending && investment.status === 'pending' && (
                    <>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => onAcceptInvestment?.(investment.id)}
                      >
                        Aceitar
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => onRejectInvestment?.(investment.id)}
                      >
                        Rejeitar
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}