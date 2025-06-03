// src/components/modals/LandDetailsModal.tsx
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Land } from '@/services/landService'; // Importe a interface Land

interface LandDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  landDetails: Land | null;
  loadingDetails: boolean;
  errorDetails?: string | undefined;
  onOpenEditModal: (land: Land) => void; // Para permitir edição a partir daqui
}

export function LandDetailsModal({
  isOpen,
  onClose,
  landDetails,
  loadingDetails,
  errorDetails,
  onOpenEditModal,
}: LandDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Terreno</DialogTitle>
          <DialogDescription>
            Informações completas sobre o terreno selecionado.
          </DialogDescription>
        </DialogHeader>
        {loadingDetails ? (
          <div className="flex items-center justify-center py-4">Carregando detalhes...</div>
        ) : errorDetails ? (
          <p className="text-red-500 text-center py-4">{errorDetails}</p>
        ) : landDetails ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">ID:</span>
              <span>{landDetails.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Rua:</span>
              <span>{landDetails.street}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Número:</span>
              <span>{landDetails.number}</span>
            </div>
            {landDetails.complement && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Complemento:</span>
                <span>{landDetails.complement}</span>
              </div>
            )}
            {landDetails.district && (
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Bairro:</span>
                <span>{landDetails.district}</span>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Cidade:</span>
              <span>{landDetails.city}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Estado:</span>
              <span>{landDetails.state}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">CEP:</span>
              <span>{landDetails.postal_code}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">País:</span>
              <span>{landDetails.country}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Preço:</span>
              <span>R$ {parseFloat(landDetails.price).toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <span className="font-semibold">Disponibilidade:</span>
              <span>{landDetails.availability ? 'Sim' : 'Não'}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Nenhum detalhe disponível.</p>
        )}
        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
          {landDetails && (
            <Button
              variant="outline"
              onClick={() => {
                onClose(); // Fecha o modal de detalhes
                onOpenEditModal(landDetails); // Abre o modal de edição
              }}
            >
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}