"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import { ProjectCard } from "@/components/cards/ProjectCard";
import { NewProjectForm } from "@/components/ui/NewProjectForm";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  location: string;
  capacity: number;
  status: string;
}

interface NewProjectFormData {
  title: string;
  location: string;
  capacity: number;
}

export default function CompanyProjectsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "VoltzX | Meus Projetos";
    if (!isLoading && (!isAuthenticated || user?.user_type !== "company")) {
      router.push("/signin");
    } else if (isAuthenticated && user?.user_type === "company") {
      fetchProjects();
    }
  }, [isAuthenticated, isLoading, user]);

  async function fetchProjects() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/projects/company");
      if (!response.ok) throw new Error("Erro ao carregar projetos");
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (err) {
      setError("Erro ao carregar projetos. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject(data: NewProjectFormData) {
    try {
      const dataWithStatus = { ...data, status: "rascunho" };

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithStatus),
      });

      if (!response.ok) throw new Error("Erro ao criar projeto");

      const newProject: Project = await response.json();
      setProjects((prev) => [...prev, newProject]);
      setIsModalOpen(false);
    } catch (err) {
      setError("Erro ao criar projeto. Tente novamente mais tarde.");
    }
  }

  if (isLoading || loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Carregando projetos...
      </div>
    );

  if (!isAuthenticated || user?.user_type !== "company") return null;

  return (
    <div className="p-6 sm:p-8 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-500">Meus Projetos</h1>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-yellow-500 hover:bg-yellow-600 rounded-2xl px-6 py-2 shadow-md text-white"
        >
          + Novo Projeto
        </Button>
      </div>

      {error && (
        <div className="mb-4 text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Novo Projeto</h2>
            <NewProjectForm onSubmit={handleCreateProject} />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {projects.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-lg">Você ainda não cadastrou nenhum projeto.</p>
          <p className="text-sm text-gray-400 mt-2">
            Clique em "+ Novo Projeto" para começar.
          </p>
        </div>
      )}
    </div>
  );
}
