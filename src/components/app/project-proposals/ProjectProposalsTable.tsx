// src/components/tables/ProjectProposalsTable.tsx
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
import { ProjectProposal } from '@/services/projectProposalService'; // Importe a interface

interface ProjectProposalsTableProps {
  title: string;
  proposals: ProjectProposal[];
  onViewDetails: (proposal: ProjectProposal) => void;
  onAcceptProposal?: (proposalId: string) => void; // Opcional, para propostas pendentes
  onRejectProposal?: (proposalId: string) => void; // Opcional, para propostas pendentes
  showActionsForPending: boolean; // Controla a visibilidade dos botões de ação
}

export function ProjectProposalsTable({
  title,
  proposals,
  onViewDetails,
  onAcceptProposal,
  onRejectProposal,
  showActionsForPending,
}: ProjectProposalsTableProps) {
  return (
    <div className="rounded-md border">
      <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">{title}</h2>
      {proposals.length === 0 ? (
        <p className="p-4 text-center text-gray-500">Nenhuma proposta {title.toLowerCase().replace('propostas ', '')} encontrada.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Terreno</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">{proposal.project?.title || 'N/A'}</TableCell>
                <TableCell>{`${proposal.land?.street || 'N/A'}, ${proposal.land?.city || 'N/A'}`}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${proposal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${proposal.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}
                      ${proposal.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                    `}
                  >
                    {proposal.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(proposal.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onViewDetails(proposal)}>
                    Ver Detalhes
                  </Button>
                  {showActionsForPending && proposal.status === 'pending' && (
                    <>
                      <Button variant="default" size="sm" onClick={() => onAcceptProposal?.(proposal.id)}>
                        Aceitar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => onRejectProposal?.(proposal.id)}>
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