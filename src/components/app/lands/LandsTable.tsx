// src/components/tables/LandsTable.tsx
"use client"; // Essencial se houver interatividade como botões

import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Land } from '@/services/landService'; // Importe a interface Land

interface LandsTableProps {
  lands: Land[];
  onViewDetails: (landId: string) => void;
  onOpenEditModal: (land: Land) => void;
  onDeleteLand: (landId: string) => void;
}

export function LandsTable({ lands, onViewDetails, onOpenEditModal, onDeleteLand }: LandsTableProps) {
  if (lands.length === 0) {
    return <p>Você ainda não tem terrenos cadastrados. Cadastre um novo!</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Lista dos seus terrenos cadastrados.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Rua</TableHead>
            <TableHead>Número</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Disponibilidade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lands.map((land) => (
            <TableRow key={land.id}>
              <TableCell className="text-xs">{land.id.substring(0, 8)}...</TableCell>
              <TableCell>{land.street}</TableCell>
              <TableCell>{land.number}</TableCell>
              <TableCell>{land.city}</TableCell>
              <TableCell>{land.state}</TableCell>
              <TableCell>R$ {parseFloat(land.price).toFixed(2)}</TableCell>
              <TableCell>{land.availability ? 'Sim' : 'Não'}</TableCell>
              <TableCell className="text-right flex space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewDetails(land.id)}
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenEditModal(land)}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteLand(land.id)}
                >
                  Excluir
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}