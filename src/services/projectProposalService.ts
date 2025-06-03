import { getAuthToken } from '@/lib/auth';

export type AgreementStatus = 'pending' | 'accepted' | 'rejected';
export type OwnerAgreementStatus = 'pending' | 'accepted' | 'rejected'; // Ajuste conforme o seu enum real se for usado no frontend
export type SolarProjectStatus = 'pending' | 'active' | 'completed' | 'canceled'; // Ajuste conforme o seu enum real se for usado no frontend

// Interfaces (mantidas como estão, usando os tipos locais AgreementStatus, etc.)
export interface Project {
  id: string;
  land_id: string;
  company_id: string | null;
  power_kw: string;
  cost: string;
  estimated_return: string;
  status: SolarProjectStatus;
  created_at: string;
  title: string;
  description: string | null;
}

export interface Land {
  id: string;
  owner_id: string;
  price: string;
  availability: boolean;
  street: string;
  number: string;
  complement: string | null;
  district: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectProposal {
  id: string;
  project_id: string;
  land_id: string;
  status: AgreementStatus; // Usando o tipo definido localmente
  owner_agreed: OwnerAgreementStatus; // Usando o tipo definido localmente
  created_at: string;
  updated_at: string;
  project: Project;
  land: Land;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const projectProposalService = {
  // Função para buscar propostas PENDENTES
  async getMyProjectProposalsPending(): Promise<ProjectProposal[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    // Usando a string literal diretamente
    const response = await fetch(`${API_URL}/api/land-owners/my-project-proposals?status=pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar propostas pendentes.');
    }

    return response.json();
  },

  // Função para buscar propostas ACEITAS
  async getMyProjectProposalsAccepted(): Promise<ProjectProposal[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    // Usando a string literal diretamente
    const response = await fetch(`${API_URL}/api/land-owners/my-project-proposals?status=accepted`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar propostas aceitas.');
    }

    return response.json();
  },

  // Função para buscar propostas REJEITADAS
  async getMyProjectProposalsRejected(): Promise<ProjectProposal[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    // Usando a string literal diretamente
    const response = await fetch(`${API_URL}/api/land-owners/my-project-proposals?status=rejected`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar propostas rejeitadas.');
    }

    return response.json();
  },

  // Método para responder à proposta (este não muda, já está ok)
  async ownerRespondToProposal(proposalId: string, responseAction: 'accept' | 'reject'): Promise<ProjectProposal> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/project-proposals/${proposalId}/owner-response`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ response: responseAction }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao responder à proposta.');
    }

    return response.json();
  },

  // Método para buscar detalhes de uma única proposta (este não muda, já está ok)
  async getProjectProposalById(id: string): Promise<ProjectProposal> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/project-proposals/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar detalhes da proposta.');
    }

    return response.json();
  },
};