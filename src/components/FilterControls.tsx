import React from 'react';
import { Search, X, SlidersHorizontal, ArrowDownUp } from 'lucide-react';
import { ObjectiveFilter, SortOption, StudyObjective } from '../types/objective';

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentFilter: ObjectiveFilter;
  onFilterChange: (filter: ObjectiveFilter) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  objectives: StudyObjective[];
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  onSearchChange,
  currentFilter,
  onFilterChange,
  sortOption,
  onSortChange,
  objectives,
}) => {
  const countAll = objectives.length;
  const countNaoIniciado = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const countEmAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const countConcluido = objectives.filter((o) => o.status === 'concluido').length;

  const filterTabs: Array<{ id: ObjectiveFilter; label: string; count: number }> = [
    { id: 'todos', label: 'Todos', count: countAll },
    { id: 'nao_iniciado', label: 'Não iniciados', count: countNaoIniciado },
    { id: 'em_andamento', label: 'Em andamento', count: countEmAndamento },
    { id: 'concluido', label: 'Concluídos', count: countConcluido },
  ];

  return (
    <div className="space-y-4">
      {/* Linha superior: Busca e Ordenação */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Barra de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-10 pr-9 py-2.5 bg-white rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-colors shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 hidden md:inline-flex items-center gap-1">
            <ArrowDownUp className="w-3.5 h-3.5" />
            Ordenar por:
          </span>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full sm:w-auto px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-2xs cursor-pointer"
          >
            <option value="prazo_asc">📅 Prazo mais próximo</option>
            <option value="prazo_desc">📅 Prazo mais distante</option>
            <option value="recentes">⏱️ Mais recentes</option>
            <option value="alfabetica">🔤 Ordem alfabética (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas de Filtros de Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
