// src/components/dashboard/DashboardMetricCard.tsx
"use client";

import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'; // Supondo que você tenha esses componentes da Shadcn UI
import { Button } from '@/components/ui/button'; // Para o botão "View X"
import Link from 'next/link'; // Para navegação sem recarregar a página

interface DashboardMetricCardProps {
  title: string;
  count: number | string; // Pode ser um número ou um texto (ex: 'Carregando...')
  linkHref: string;
  linkText: string;
  isLoading?: boolean; // Para indicar que a contagem está sendo carregada
  className?: string; // Para estilos adicionais no card
}

export function DashboardMetricCard({
  title,
  count,
  linkHref,
  linkText,
  isLoading = false,
  className,
}: DashboardMetricCardProps) {
  return (
    <Card className={`text-center ${className}`}>
      <CardHeader className="text-lg font-semibold bg-primary text-primary-foreground py-3 rounded-t-lg">
        {title}
      </CardHeader>
      <CardContent className="flex items-center justify-center p-6">
        {isLoading ? (
          <span className="text-4xl font-bold text-gray-500">...</span>
        ) : (
          <span className="text-5xl font-bold text-gray-800">{count}</span>
        )}
      </CardContent>
      <CardFooter className="p-0">
        <Link href={linkHref} passHref className="w-full">
          <Button variant="link" className="w-full text-white bg-primary hover:bg-primary/90 rounded-b-lg rounded-t-none">
            {linkText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}