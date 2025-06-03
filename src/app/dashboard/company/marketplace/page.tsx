"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Icon({ children }: { children: React.ReactNode }) {
  return <div className="text-yellow-500 w-10 h-10 mb-2">{children}</div>;
}

export default function MarketplacePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [terrenos, setTerrenos] = useState<any[]>([]);
  const [projetos, setProjetos] = useState<any[]>([]);
  const [investimentos, setInvestimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    document.title = "Marketplace | VoltzX";
    if (!isLoading && (!isAuthenticated || user?.user_type !== "company")) {
      router.push("/signin");
    } else if (isAuthenticated && user?.user_type === "company") {
      fetchData();
    }
  }, [isAuthenticated, isLoading, user]);

  async function fetchData() {
    try {
      const [landsRes, projectsRes, investmentsRes] = await Promise.all([
        fetch("/api/lands/available"),
        fetch("/api/projects/company"),
        fetch("/api/investments"),
      ]);

      if (!landsRes.ok || !projectsRes.ok || !investmentsRes.ok) {
        throw new Error("Erro ao buscar dados do servidor");
      }

      const lands = await landsRes.json();
      const projects = await projectsRes.json();
      const investments = await investmentsRes.json();

      setTerrenos(lands);
      setProjetos(projects);
      setInvestimentos(investments);
    } catch (error) {
      setErro("Erro ao buscar dados. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  if (isLoading || loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Carregando...
      </div>
    );
  if (!isAuthenticated || user?.user_type !== "company") return null;

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Marketplace da Empresa</h1>
        <nav className="space-x-4">
          <Link
            href="/dashboard/company/projects"
            className="text-sm text-gray-700 hover:text-yellow-500"
          >
            Meus Projetos
          </Link>
          <Link
            href="/dashboard/company/chat"
            className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Chat
          </Link>
        </nav>
      </div>

      {erro && (
        <div className="max-w-6xl mx-auto px-4 mt-4 text-red-600 font-semibold">
          {erro}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                </Icon>
                Terrenos Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                {terrenos.slice(0, 3).map((t) => (
                  <li key={t.id}>• {t.nome || `${t.street}, ${t.city}`}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="13 2 13 13 18 13 11 22 11 11 6 11 13 2" />
                  </svg>
                </Icon>
                Projetos em Andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                {projetos.slice(0, 3).map((p) => (
                  <li key={p.id}>• {p.titulo}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon>
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8v8M8 12h8M21 12c0 5-4 9-9 9s-9-4-9-9 4-9 9-9 9 4 9 9z" />
                  </svg>
                </Icon>
                Ofertas de Investimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                {investimentos.slice(0, 3).map((i) => (
                  <li key={i.id}>
                    • {i.nomeInvestidor || i.user?.name || "Investidor Anônimo"}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
