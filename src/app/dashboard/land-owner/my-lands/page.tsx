/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/owner/lands/page.tsx
'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { landService, Land, CreateLandDto, UpdateLandDto } from '@/services/landService';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { NewLandForm } from '@/components/app/lands/newLandForm';
import { LandsTable } from '@/components/app/lands/LandsTable';
import { EditLandModal } from '@/components/app/lands/EditLandModal';
import { LandDetailsModal } from '@/components/app/lands/LandDetailsModal';

export default function MyLandsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [myLands, setMyLands] = useState<Land[]>([]);
  const [loadingLands, setLoadingLands] = useState(true);
  const [errorLands, setErrorLands] = useState('');

  // Estados para o formulário de novo terreno
  const [newLandData, setNewLandData] = useState<CreateLandDto>({
    price: '',
    street: '',
    number: '',
    complement: '',
    district: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
  });
  const [isNewLandModalOpen, setIsNewLandModalOpen] = useState(false); // Renomeado para clareza

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // --- Novos estados para o Modal de Detalhes ---
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedLandDetails, setSelectedLandDetails] = useState<Land | null>(null);
  const [loadingLandDetails, setLoadingLandDetails] = useState(false);
  const [errorLandDetails, setErrorLandDetails] = useState('');
  // --- Fim dos novos estados ---

  const [isEditLandModalOpen, setIsEditLandModalOpen] = useState<boolean>(false);
  const [editLandData, setEditLandData] = useState<UpdateLandDto & { id: string } | null>(null); // Inclui o ID para a requisição
  const [editFormLoading, setEditFormLoading] = useState<boolean>(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);



  useEffect(() => {
    document.title = 'VoltzX | Meus Terrenos';
    if (!isLoading && (!isAuthenticated || user?.user_type !== 'land_owner')) {
      router.push('/signin');
    } else if (isAuthenticated && user?.user_type === 'land_owner') {
      fetchMyLands();
    }
  }, [isAuthenticated, isLoading, user, router]);

  const fetchMyLands = async () => {
    setLoadingLands(true);
    setErrorLands('');
    try {
      const lands = await landService.getMyLands();
      setMyLands(lands);
    } catch (err: any) {
      setErrorLands(err.message || 'Erro ao carregar seus terrenos.');
    } finally {
      setLoadingLands(false);
    }
  };

  const handleCreateLand = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (!newLandData.price || !newLandData.street || !newLandData.number ||
          !newLandData.city || !newLandData.state || !newLandData.postal_code ||
          !newLandData.country) {
        setFormError('Por favor, preencha todos os campos obrigatórios.');
        setFormLoading(false);
        return;
      }

      const dataToSend: CreateLandDto = {
        price: newLandData.price,
        street: newLandData.street,
        number: newLandData.number,
        city: newLandData.city,
        state: newLandData.state,
        postal_code: newLandData.postal_code,
        country: newLandData.country,
      };
      if (newLandData.complement) dataToSend.complement = newLandData.complement;
      if (newLandData.district) dataToSend.district = newLandData.district;

      const createdLand = await landService.createLand(dataToSend);
      setMyLands((prevLands) => [...prevLands, createdLand]);
      setNewLandData({
        price: '', street: '', number: '', complement: '', district: '',
        city: '', state: '', postal_code: '', country: '',
      });
      setIsNewLandModalOpen(false); // Usar o novo estado
      alert('Terreno cadastrado com sucesso!');
    } catch (err: any) {
      setFormError(err.message || 'Erro ao cadastrar terreno.');
    } finally {
      setFormLoading(false);
    }
  };

  // --- Nova função para buscar e exibir detalhes do terreno ---
  const handleViewDetails = async (landId: string) => {
    setLoadingLandDetails(true);
    setErrorLandDetails('');
    setSelectedLandDetails(null);
    setIsDetailsModalOpen(true); // Abre o modal antes de buscar para mostrar o "Carregando..."
    try {
      const land = await landService.getLandById(landId); // Assumindo que você tem um método getLandById
      setSelectedLandDetails(land);
    } catch (err: any) {
      setErrorLandDetails(err.message || 'Erro ao carregar detalhes do terreno.');
      setSelectedLandDetails(null); // Limpa os detalhes se houver erro
    } finally {
      setLoadingLandDetails(false);
    }
  };
  // --- Fim da nova função ---

   const handleDeleteLand = async (landId: string) => {
    if (!confirm('Tem certeza que deseja excluir este terreno? Esta ação não pode ser desfeita.')) {
      return;
    }

    setLoadingLands(true); // Opcional: mostrar um loader geral enquanto a exclusão ocorre
    try {
      await landService.deleteLandById(landId);
      toast.success('Terreno excluído com sucesso!');
      fetchMyLands(); // Recarrega a lista de terrenos após a exclusão
    } catch (err: any) {
      toast.error(err.message || 'Erro ao excluir terreno.');
      setErrorLands(err.message || 'Erro ao excluir terreno.'); // Atualiza o erro geral se houver
    } finally {
      setLoadingLands(false); // Opcional: esconder o loader
    }
  };

  const handleOpenEditModal = (land: Land) => {
    setIsEditLandModalOpen(true);
    // Popula o estado de edição com os dados atuais do terreno
    setEditLandData({
      id: land.id,
      price: land.price,
      street: land.street,
      number: land.number,
      complement: land.complement || '', // Garante string vazia se for null
      district: land.district || '',     // Garante string vazia se for null
      city: land.city,
      state: land.state,
      postal_code: land.postal_code,
      country: land.country,
      availability: land.availability,
    });
  };

  // NOVA FUNÇÃO: Lidar com a submissão do formulário de edição
  const handleEditLand = async (e: FormEvent) => {
    e.preventDefault();
    if (!editLandData || !editLandData.id) return;

    setEditFormLoading(true);
    setEditFormError(null);

    const { id, ...dataToUpdate } = editLandData;

    try {
      // Ajuste o preço para ter duas casas decimais no formato string se necessário
      if (dataToUpdate.price) {
        dataToUpdate.price = parseFloat(dataToUpdate.price).toFixed(2);
      }

      await landService.updateLandById(id, dataToUpdate);
      toast.success('Terreno atualizado com sucesso!');
      setIsEditLandModalOpen(false);
      setEditLandData(null); // Limpa os dados do formulário de edição
      fetchMyLands(); // Recarrega a lista de terrenos para refletir a mudança
    } catch (err: any) {
      setEditFormError(err.message || 'Erro ao atualizar terreno.');
      toast.error(err.message || 'Erro ao atualizar terreno.');
    } finally {
      setEditFormLoading(false);
    }
  };


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!isAuthenticated || user?.user_type !== 'land_owner') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar (Left Column) */}
      <div className="md:col-span-2">
        <div className="bg-white shadow-md rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-gray-700 mb-2">Ações</h3>
          <Dialog open={isNewLandModalOpen} onOpenChange={setIsNewLandModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full justify-start">Cadastrar Novo Terreno</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Terreno</DialogTitle>
              </DialogHeader>
              <NewLandForm
                data={newLandData}
                setData={setNewLandData}
                onSubmit={handleCreateLand}
                loading={formLoading}
                error={formError}
              />  
            </DialogContent>
          </Dialog>
          {/* Adicione outros links de sidebar aqui */}
        </div>
      </div>

      {/* Main Content (Right Column) */}
      <div className="md:col-span-10 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Seus Terrenos Cadastrados</h2>
        {loadingLands ? (
          <p>Carregando terrenos...</p>
        ) : errorLands ? (
          <p className="text-red-500">{errorLands}</p>
        ) : myLands.length === 0 ? (
          <p>Você ainda não tem terrenos cadastrados. Cadastre um novo!</p>
        ) : (
          <div className="overflow-x-auto">
            <LandsTable
            lands={myLands}
            onViewDetails={handleViewDetails}
            onOpenEditModal={handleOpenEditModal}
            onDeleteLand={handleDeleteLand}
          />
          </div>
        )}
      </div>

      {/* --- Modal de Detalhes do Terreno --- */}
       <LandDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        landDetails={selectedLandDetails}
        loadingDetails={loadingLandDetails}
        errorDetails={errorLandDetails}
        onOpenEditModal={handleOpenEditModal} // Passando a função para abrir a edição
      />
      {/* --- Fim do Modal de Detalhes do Terreno --- */}

      {/* --- NOVO MODAL DE EDIÇÃO DO TERRENO --- */}
      <EditLandModal
          isOpen={isEditLandModalOpen}
          onClose={() => setIsEditLandModalOpen(false)}
          landData={editLandData}
          setLandData={setEditLandData}
          onSubmit={handleEditLand}
          loading={editFormLoading}
          error={editFormError ?? undefined}
        />
      {/* --- FIM DO NOVO MODAL DE EDIÇÃO DO TERRENO --- */}
    </div>

    </div>
  );
}