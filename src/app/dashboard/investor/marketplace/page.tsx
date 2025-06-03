"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { ProjectCard } from "@/components/cards/ProjectCard";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  investment_needed: number;
  investment_received: number;
  company: {
    name: string;
  };
  land: {
    location: string;
  };
  capacity: number;
  status: string;
}

interface InvestmentOffer {
  amount: number;
  message: string;
}

export default function InvestorMarketplacePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [offer, setOffer] = useState<InvestmentOffer>({ amount: 0, message: "" });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    document.title = "VoltzX | Marketplace de Projetos";

    
    if (!isLoading) {
      if (!isAuthenticated || user?.user_type !== "investor") {
        router.push("/signin");
      } else {
        fetchProjects();
      }
    }
  }, [isAuthenticated, isLoading, user]);

  async function fetchProjects() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Erro ao buscar projetos");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError("Erro ao carregar os projetos. Tente novamente mais tarde.");
      toast.error("Erro ao carregar os projetos.");
    } finally {
      setLoading(false);
    }
  }

  function openOfferModal(project: Project) {
    setSelectedProject(project);
    setOffer({ amount: 0, message: "" });
    setModalOpen(true);
  }

  function closeOfferModal() {
    setSelectedProject(null);
    setModalOpen(false);
  }

  async function submitOffer() {
    if (!selectedProject) return;

    if (offer.amount <= 0) {
      toast.error("Informe um valor válido para a oferta.");
      return;
    }

    try {
      const res = await fetch(`/api/projects/${selectedProject.id}/investments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offer),
      });

      if (!res.ok) throw new Error("Erro ao enviar oferta");

      toast.success("Oferta enviada com sucesso!");
      closeOfferModal();
    } catch (err) {
      setError("Falha ao enviar a oferta. Tente novamente mais tarde.");
      toast.error("Falha ao enviar a oferta.");
    }
  }

  
  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading || loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Carregando projetos...
      </div>
    );

  if (!isAuthenticated || user?.user_type !== "investor") return null;

  return (
    <div className="p-6 sm:p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-yellow-500 mb-6">
        Marketplace de Projetos
      </h1>

      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}

      <Input
        placeholder="Buscar projetos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {filteredProjects.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum projeto encontrado.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <ProjectCard project={project} />
              <button
                onClick={() => openOfferModal(project)}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 rounded-2xl px-6 py-2 shadow-md text-white w-full"
              >
                Fazer Oferta
              </button>
            </div>
          ))}
        </div>
      )}

      {modalOpen && selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeOfferModal}
        >
          <div
            className="bg-white rounded-lg max-w-xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">
              Fazer Oferta - {selectedProject.title}
            </h2>

            <label className="block mb-2 font-semibold">
              Valor da Oferta (R$)
              <input
                type="number"
                min={0}
                value={offer.amount}
                onChange={(e) =>
                  setOffer((o) => ({ ...o, amount: Number(e.target.value) }))
                }
                className="border p-2 w-full rounded"
              />
            </label>

            <label className="block mb-4 font-semibold">
              Mensagem (opcional)
              <textarea
                value={offer.message}
                onChange={(e) =>
                  setOffer((o) => ({ ...o, message: e.target.value }))
                }
                className="border p-2 w-full rounded"
                rows={3}
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeOfferModal}
                className="mt-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={submitOffer}
                className="mt-2 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
              >
                Enviar Oferta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

