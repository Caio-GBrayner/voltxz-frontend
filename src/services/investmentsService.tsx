import { getAuthToken } from '@/lib/auth';

// Definição manual dos tipos de status que você usa no frontend
// Certifique-se de que estes tipos correspondem aos seus enums do Prisma
export type AgreementStatus = 'pending' | 'accepted' | 'rejected';
export type InvestmentStatus = 'pending' | 'accepted' | 'rejected';
export type SolarProjectStatus = 'pendingApproval' | 'active' | 'completed' | 'rejected'; // Ajustado para 'pendingApproval' conforme seu enum Prisma

// Interfaces baseadas no schema do Prisma, adaptadas para o frontend
// Onde o Prisma usa Decimal, no frontend geralmente é melhor usar string para evitar problemas de precisão.
export interface Project {
  id: string;
  land_id: string;
  company_id: string | null;
  power_kw: string; // Decimal no Prisma, string no frontend
  cost: string; // Decimal no Prisma, string no frontend
  estimated_return: string; // Decimal no Prisma, string no frontend
  status: SolarProjectStatus;
  created_at: string; // DateTime no Prisma, string no frontend
  title: string;
  description: string | null;
  area: string; // Decimal no Prisma, string no frontend
}

export interface Land {
  id: string;
  owner_id: string;
  price: string; // Decimal no Prisma, string no frontend
  availability: boolean;
  street: string;
  number: string;
  complement: string | null;
  district: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  created_at: string; // DateTime no Prisma, string no frontend
  updated_at: string; // DateTime no Prisma, string no frontend
}

export interface Investor {
  id: string;
  user_id: string;
  document_id: string;
}

export interface Investment {
  id: string;
  project_id: string;
  project: Project; // Inclui os detalhes do projeto relacionado
  investor_id: string;
  investor: Investor; // Inclui os detalhes do investidor relacionado
  value_invested: string; // Decimal no Prisma, string no frontend
  invested_date: string; // DateTime no Prisma, string no frontend
  owner_agree: AgreementStatus;
  company_agree: AgreementStatus;
  title: string | null;
  description: string | null;
  status: InvestmentStatus;
}

// URL base da API, obtida de variáveis de ambiente
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const investmentService = {
  /**
   * Busca todos os investimentos com status 'pending' para o usuário logado como proprietário de terra.
   * @returns {Promise<Investment[]>} Uma promessa que resolve para um array de objetos Investment.
   * @throws {Error} Se o usuário não estiver autenticado ou se houver um erro na requisição.
   */
  async getMyInvestmentsPending(): Promise<Investment[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/land-owners/my-investments?status=pending`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar investimentos pendentes.');
    }

    return response.json();
  },

  /**
   * Busca todos os investimentos com status 'accepted' para o usuário logado como proprietário de terra.
   * @returns {Promise<Investment[]>} Uma promessa que resolve para um array de objetos Investment.
   * @throws {Error} Se o usuário não estiver autenticado ou se houver um erro na requisição.
   */
  async getMyInvestmentsAccepted(): Promise<Investment[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/land-owners/my-investments?status=accepted`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar investimentos aceitos.');
    }

    return response.json();
  },

  /**
   * Busca todos os investimentos com status 'rejected' para o usuário logado como proprietário de terra.
   * @returns {Promise<Investment[]>} Uma promessa que resolve para um array de objetos Investment.
   * @throws {Error} Se o usuário não estiver autenticado ou se houver um erro na requisição.
   */
  async getMyInvestmentsRejected(): Promise<Investment[]> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    const response = await fetch(`${API_URL}/api/land-owners/my-investments?status=rejected`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar investimentos rejeitados.');
    }

    return response.json();
  },

  /**
   * Permite que o proprietário de terra responda a um investimento (aceitar ou rejeitar).
   * @param {string} investmentId O ID do investimento a ser respondido.
   * @param {'accept' | 'reject'} responseAction A ação de resposta ('accept' ou 'reject').
   * @returns {Promise<Investment>} Uma promessa que resolve para o objeto Investment atualizado.
   * @throws {Error} Se o usuário não estiver autenticado ou se houver um erro na requisição.
   */
  async ownerRespondToInvestment(investmentId: string, responseAction: 'accept' | 'reject'): Promise<Investment> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    // Assumindo que você terá um endpoint PATCH para responder a investimentos
    // Você precisará criar este endpoint no seu backend (e.g., /api/investments/:id/owner-response)
    const response = await fetch(`${API_URL}/api/investments/${investmentId}/owner-response`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ response: responseAction }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao responder ao investimento.');
    }

    return response.json();
  },

  /**
   * Busca os detalhes de um único investimento por ID.
   * @param {string} id O ID do investimento.
   * @returns {Promise<Investment>} Uma promessa que resolve para o objeto Investment.
   * @throws {Error} Se o usuário não estiver autenticado ou se houver um erro na requisição.
   */
  async getInvestmentById(id: string): Promise<Investment> {
    const token = getAuthToken();
    if (!token) {
      throw new Error('Usuário não autenticado. Por favor, faça login.');
    }

    // Assumindo que você terá um endpoint GET para buscar um único investimento
    // (e.g., /api/investments/:id)
    const response = await fetch(`${API_URL}/api/investments/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao buscar detalhes do investimento.');
    }

    return response.json();
  },
};
