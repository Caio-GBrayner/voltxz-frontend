// src/components/modals/EditLandModal.tsx
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UpdateLandDto } from '@/services/landService'; // Importe o DTO de atualização

interface EditLandModalProps {
  isOpen: boolean;
  onClose: () => void;
  landData: (UpdateLandDto & { id: string }) | null; // Inclui o ID
  setLandData: (data: (UpdateLandDto & { id: string }) | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string | undefined;
}

export function EditLandModal({
  isOpen,
  onClose,
  landData,
  setLandData,
  onSubmit,
  loading,
  error,
}: EditLandModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Terreno</DialogTitle>
          <DialogDescription>
            Altere as informações do terreno e clique em salvar.
          </DialogDescription>
        </DialogHeader>
        {landData ? (
          <form onSubmit={onSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-street" className="text-right">Rua</Label>
              <Input
                id="edit-street"
                value={landData.street || ''}
                onChange={(e) => setLandData({ ...landData, street: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-number" className="text-right">Número</Label>
              <Input
                id="edit-number"
                value={landData.number || ''}
                onChange={(e) => setLandData({ ...landData, number: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-complement" className="text-right">Complemento</Label>
              <Input
                id="edit-complement"
                value={landData.complement || ''}
                onChange={(e) => setLandData({ ...landData, complement: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-district" className="text-right">Bairro</Label>
              <Input
                id="edit-district"
                value={landData.district || ''}
                onChange={(e) => setLandData({ ...landData, district: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-city" className="text-right">Cidade</Label>
              <Input
                id="edit-city"
                value={landData.city || ''}
                onChange={(e) => setLandData({ ...landData, city: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-state" className="text-right">Estado</Label>
              <Input
                id="edit-state"
                value={landData.state || ''}
                onChange={(e) => setLandData({ ...landData, state: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-postal_code" className="text-right">CEP</Label>
              <Input
                id="edit-postal_code"
                value={landData.postal_code || ''}
                onChange={(e) => setLandData({ ...landData, postal_code: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-country" className="text-right">País</Label>
              <Input
                id="edit-country"
                value={landData.country || ''}
                onChange={(e) => setLandData({ ...landData, country: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">Preço (R$)</Label>
              <Input
                id="edit-price"
                type="text"
                value={landData.price || ''}
                onChange={(e) => setLandData({ ...landData, price: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-availability" className="text-right">Disponibilidade</Label>
              <input
                id="edit-availability"
                type="checkbox"
                checked={landData.availability || false}
                onChange={(e) => setLandData({ ...landData, availability: e.target.checked })}
                className="col-span-3 h-5 w-5"
              />
            </div>

            {error && <p className="text-red-500 text-center col-span-4">{error}</p>}
            <DialogFooter className="col-span-4">
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex items-center justify-center py-4">Nenhum terreno selecionado para edição.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}