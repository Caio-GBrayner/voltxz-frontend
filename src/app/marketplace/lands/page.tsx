/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/marketplace/lands/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { landService, Land } from '@/services/landService';
import { Button } from '@/components/ui/button';
import { Input as ShadcnInput } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function MarketplaceLandsPage() {
  const [lands, setLands] = useState<Land[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    document.title = 'VoltzX | Marketplace';
    fetchLands();
  }, []);

  const fetchLands = async () => {
    setLoading(true);
    setError('');
    try {
      const allLands = await landService.getAllLands();
      setLands(allLands.filter((l: Land) => l.availability));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar terrenos.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (landId: string) => {
    setLoadingDetails(true);
    setErrorDetails('');
    setSelectedLand(null);
    setIsDetailsModalOpen(true);
    try {
      const land = await landService.getLandById(landId);
      setSelectedLand(land);
    } catch (err: any) {
      setErrorDetails(err.message || 'Erro ao carregar detalhes.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredLands = lands.filter((land) =>
    land.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    land.street.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-yellow-700 mb-6">Terrenos disponíveis</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-md">
            <ShadcnInput
              type="search"
              placeholder="Buscar por cidade, estado ou rua..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <p>Carregando terrenos...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredLands.length === 0 ? (
          <p>Nenhum terreno disponível encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Terrenos disponíveis no marketplace.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Rua</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLands.map((land) => (
                  <TableRow key={land.id}>
                    <TableCell>{land.id}</TableCell>
                    <TableCell>{land.street}</TableCell>
                    <TableCell>{land.city}</TableCell>
                    <TableCell>{land.state}</TableCell>
                    <TableCell>R$ {parseFloat(land.price).toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleViewDetails(land.id)}>
                        Ver Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Terreno</DialogTitle>
            <DialogDescription>
              Informações sobre o terreno selecionado.
            </DialogDescription>
          </DialogHeader>
          {loadingDetails ? (
            <p className="py-4 text-center">Carregando detalhes...</p>
          ) : errorDetails ? (
            <p className="text-red-500 text-center py-4">{errorDetails}</p>
          ) : selectedLand ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">ID:</span>
                <span>{selectedLand.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Rua:</span>
                <span>{selectedLand.street}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Número:</span>
                <span>{selectedLand.number}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Cidade:</span>
                <span>{selectedLand.city}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Estado:</span>
                <span>{selectedLand.state}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">CEP:</span>
                <span>{selectedLand.postal_code}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">País:</span>
                <span>{selectedLand.country}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-semibold">Preço:</span>
                <span>R$ {parseFloat(selectedLand.price).toFixed(2)}</span>
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
    </div>
  );
}