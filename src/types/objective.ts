/**
 * Tipos de dados fundamentais do StudyFlow
 */

export type ObjectiveStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyObjective {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string; // Formato YYYY-MM-DD
  status: ObjectiveStatus;
  criadoEm: string; // ISO string
  atualizadoEm?: string; // ISO string
}

export type ObjectiveFormData = {
  titulo: string;
  descricao: string;
  prazo: string;
  status: ObjectiveStatus;
};

export type ObjectiveFilter = 'todos' | ObjectiveStatus;

export type SortOption = 'prazo_asc' | 'prazo_desc' | 'recentes' | 'alfabetica';

export interface StatusConfig {
  label: string;
  badgeClass: string;
  dotClass: string;
  borderClass: string;
}

export const STATUS_MAP: Record<ObjectiveStatus, StatusConfig> = {
  nao_iniciado: {
    label: 'Não iniciado',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClass: 'bg-amber-500',
    borderClass: 'border-l-amber-500',
  },
  em_andamento: {
    label: 'Em andamento',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
    borderClass: 'border-l-blue-500',
  },
  concluido: {
    label: 'Concluído',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClass: 'bg-emerald-500',
    borderClass: 'border-l-emerald-500',
  },
};
