// src/components/forms/NewLandForm.tsx
"use client"; // Essencial para componentes que usam interatividade

import React from 'react'; // Importe React se não estiver usando a nova transformação JSX
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog'; // Certifique-se de que DialogFooter é exportado de ui/dialog
import { Button } from '@/components/ui/button';
import { CreateLandDto } from '@/services/landService'; // Ajuste o caminho se necessário

interface NewLandFormProps {
  data: CreateLandDto;
  setData: (data: CreateLandDto) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error?: string | undefined; // 'undefined' é opcional e pode ser omitido
}

export function NewLandForm({ data, setData, onSubmit, loading, error }: NewLandFormProps) {
  return (
  <form onSubmit={onSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="new-street" className="text-right">Rua</Label>
        <Input
          id="new-street"
          value={data.street}
          onChange={e => setData({ ...data, street: e.target.value })}
          required
          className="col-span-3"
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-number" className="text-right">Número</Label>
        <Input
          id="new-number"
          value={data.number}
          onChange={e => setData({ ...data, number: e.target.value })}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-complement" className="text-right">Complemento</Label>
        <Input
          id="new-complement"
          value={data.complement || ''} // Garante que é uma string vazia se for null/undefined
          onChange={e => setData({ ...data, complement: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-district" className="text-right">Bairro</Label>
        <Input
          id="new-district"
          value={data.district || ''} // Garante que é uma string vazia se for null/undefined
          onChange={e => setData({ ...data, district: e.target.value })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-city" className="text-right">Cidade</Label>
        <Input
          id="new-city"
          value={data.city}
          onChange={e => setData({ ...data, city: e.target.value })}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-state" className="text-right">Estado</Label>
        <Input
          id="new-state"
          value={data.state}
          onChange={e => setData({ ...data, state: e.target.value })}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-postal_code" className="text-right">CEP</Label>
        <Input
          id="new-postal_code"
          value={data.postal_code}
          onChange={e => setData({ ...data, postal_code: e.target.value })}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-country" className="text-right">País</Label>
        <Input
          id="new-country"
          value={data.country}
          onChange={e => setData({ ...data, country: e.target.value })}
          required
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="new-price" className="text-right">Preço (R$)</Label>
        <Input
          id="new-price"
          type="text"
          value={data.price}
          onChange={e => setData({ ...data, price: e.target.value })}
          required
          className="col-span-3"
        />
      </div>
      {error && <p className="text-red-500 text-center col-span-4">{error}</p>}
      <DialogFooter className="col-span-4">
        <Button type="submit" disabled={loading} className="bg-yellow-500 hover:bg-yellow-600">
          {loading ? 'Cadastrando...' : 'Cadastrar Terreno'}
        </Button>
      </DialogFooter>
    </form>
  );
}