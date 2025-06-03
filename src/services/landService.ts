/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/landService.ts
import { getAuthToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// AJUSTADO PARA CORRESPONDER EXATAMENTE AO SEU BACKEND CreateLandDto
export interface CreateLandDto {
  price: string; // No backend é string para Decimal
  street: string;
  number: string;
  complement?: string; // Opcional, pode ser undefined no envio
  district?: string;  // Opcional, pode ser undefined no envio
  city: string;
  state: string;
  postal_code: string;
  country: string;
  // 'area' removido pois não está no seu DTO de backend
}

// AJUSTADO PARA CORRESPONDER EXATAMENTE AO MODELO 'Lands' RETORNADO PELO BACKEND
export interface Land {
  id: string;
  owner_id: string; // ID do proprietário (snake_case do banco)
  price: string; // Backend retorna como string para Decimal
  availability: boolean; // Campo 'availability' do modelo
  street: string;
  number: string;
  complement: string | null; // Pode ser string ou null
  district: string | null;   // Pode ser string ou null
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string; // DateTime como string ISO
  updated_at: string; // DateTime como string ISO
}

export interface UpdateLandDto {
  price?: string;
  availability?: boolean;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

// Interface para os tipos de dados que serão retornados pelos endpoints de propostas e investimentos
// Como o backend retorna arrays, usaremos 'any[]' para flexibilidade,
// mas você pode criar interfaces mais específicas se souber a estrutura de cada item.
interface ProjectProposalItem {
  // Defina as propriedades de uma proposta de projeto aqui, ex:
  id: string;
  projectId: string;
  landId: string;
  status: string; // Ou o enum AgreementStatus
  // ... outras propriedades
}

interface InvestmentItem {
  // Defina as propriedades de um investimento aqui, ex:
  id: string;
  projectId: string;
  investorId: string;
  valueInvested: string; // Ou Decimal
  status: string; // Ou o enum InvestmentStatus
  // ... outras propriedades
}


export const landService = {
  async createLand(data: CreateLandDto): Promise<Land> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/lands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao cadastrar terreno.');
    }

    return response.json();
  },

  async getMyLands(): Promise<Land[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/land-owners/my-lands`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar meus terrenos.');
    }

    return response.json();
  },

  async getLandById(id: string): Promise<Land> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/lands/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar detalhes do terreno.');
    }

    return response.json();
  },

  async deleteLandById(id: string): Promise<void> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/lands/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao deletar terreno.');
    }
  },

  async updateLandById(id: string, data: UpdateLandDto): Promise<Land> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/lands/${id}`, {
      method: 'PATCH', // Usamos PATCH para atualização parcial
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao atualizar terreno.');
    }

    return response.json(); // Retorna o terreno atualizado
  },

  // --- NOVAS FUNÇÕES DE CONTAGEM ---

  async getMyLandsCount(): Promise<number> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    try {
      const response = await fetch(`${API_URL}/api/land-owners/my-lands`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar contagem de terrenos.');
      }

      const lands: Land[] = await response.json();
      return lands.length;
    } catch (error: any) {
      console.error("Erro em getMyLandsCount:", error);
      throw error; // Re-lança o erro para ser tratado no componente
    }
  },

  async getMyProjectProposalsCount(): Promise<number> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    try {
      const response = await fetch(`${API_URL}/api/land-owners/my-project-proposals`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar contagem de propostas de projeto.');
      }

      const proposals: ProjectProposalItem[] = await response.json();
      return proposals.length;
    } catch (error: any) {
      console.error("Erro em getMyProjectProposalsCount:", error);
      throw error;
    }
  },

  async getMyInvestmentsCount(): Promise<number> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    try {
      const response = await fetch(`${API_URL}/api/land-owners/my-investments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao buscar contagem de investimentos.');
      }

      const investments: InvestmentItem[] = await response.json();
      return investments.length;
    } catch (error: any) {
      console.error("Erro em getMyInvestmentsCount:", error);
      throw error;
    }
  },
};