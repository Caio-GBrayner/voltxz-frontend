// src/services/profileCreationService.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://backend-container:3001";


// Definir as interfaces para os DTOs de criação
export interface CreateLandOwnerDto {
  document_id: string; // CPF
  // Não incluímos o userId aqui, pois ele será injetado pelo backend
}

export interface CreateCompanyDto {
  document_id: string; // CNPJ
  company_name: string;
}

export interface CreateInvestorDto {
  document_id: string; // CPF (ou outro ID, dependendo do seu modelo)
  // Se houver mais campos para investor além do document_id, adicione aqui
}

export const profileCreationService = {
  async createLandOwner(data: CreateLandOwnerDto, token: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/land-owners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar perfil de Proprietário.");
    }
    return response.json();
  },

  async createCompany(data: CreateCompanyDto, token: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/companies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar perfil de Empresa.");
    }
    return response.json();
  },

  async createInvestor(data: CreateInvestorDto, token: string): Promise<any> {
    const response = await fetch(`${API_URL}/api/investors`, { // Assumindo este endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao criar perfil de Investidor.");
    }
    return response.json();
  },
};