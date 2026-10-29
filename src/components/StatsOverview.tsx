import React from 'react';
import { Target, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';
import { StudyObjective } from '../types/objective';

interface StatsOverviewProps {
  objectives: StudyObjective[];
  onSelectFilter?: (status: 'todos' | 'nao_iniciado' | 'em_andamento' | 'concluido') => void;
  currentFilter?: string;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  objectives,
  onSelectFilter,
  currentFilter = 'todos',
}) => {
  const total = objectives.length;
  const naoIniciados = objectives.filter((o) => o.status === 'nao_iniciado').length;
  const emAndamento = objectives.filter((o) => o.status === 'em_andamento').length;
  const concluidos = objectives.filter((o) => o.status === 'concluido').length;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Painel de Aprendizado
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
            Resumo dos seus Objetivos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhe a sua evolução e mantenha a consistência nos estudos diários.
          </p>
        </div>

        {/* Progresso Geral */}
        <div className="flex flex-col gap-1.5 min-w-[220px]">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-600">Progresso Geral</span>
            <span className="font-bold text-indigo-700">{percentConcluido}% concluído</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentConcluido}%` }}
              role="progressbar"
              aria-valuenow={percentConcluido}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>

      {/* Cartões de Contadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
        {/* Total Cadastrado */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('todos')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'todos'
              ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200'
              : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
              {total}
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              {total === 1 ? 'Objetivo cadastrado' : 'Objetivos cadastrados'}
            </div>
          </div>
        </button>

        {/* Não Iniciados */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('nao_iniciado')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'nao_iniciado'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-200'
              : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
              {naoIniciados}
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              Não iniciados
            </div>
          </div>
        </button>

        {/* Em Andamento */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('em_andamento')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'em_andamento'
              ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-200'
              : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <PlayCircle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
              {emAndamento}
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              Em andamento
            </div>
          </div>
        </button>

        {/* Concluídos */}
        <button
          type="button"
          onClick={() => onSelectFilter?.('concluido')}
          className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
            currentFilter === 'concluido'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-200'
              : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/80 hover:border-slate-300'
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">
              {concluidos}
            </div>
            <div className="text-xs font-medium text-slate-600 mt-1">
              Concluídos
            </div>
          </div>
        </button>
      </div>
    </section>
  );
};
