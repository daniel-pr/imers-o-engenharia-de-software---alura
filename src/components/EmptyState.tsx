import React from 'react';
import { BookOpen, SearchX, Plus, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewModal: () => void;
  onClearFilter?: () => void;
  onLoadSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewModal,
  onClearFilter,
  onLoadSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Não encontramos objetivos que correspondam aos filtros ou termo de busca selecionados.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {onClearFilter && (
            <button
              onClick={onClearFilter}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Limpar filtros
            </button>
          )}
          <button
            onClick={onOpenNewModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Criar novo objetivo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-indigo-200 p-8 sm:p-14 text-center max-w-xl mx-auto my-6 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-5 ring-8 ring-indigo-50/50">
        <BookOpen className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 tracking-tight">
        Comece sua jornada de aprendizado!
      </h3>
      <p className="text-sm text-slate-600 mt-2.5 leading-relaxed max-w-md mx-auto">
        Você ainda não cadastrou nenhum objetivo de estudo. Definir metas claras, mesmo que pequenas, é o primeiro passo para aprender qualquer disciplina.
      </p>

      <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenNewModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Cadastrar meu primeiro objetivo
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Carregar exemplos para iniciantes
          </button>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
        <span>💡 Seus dados ficam salvos automaticamente no seu navegador.</span>
      </div>
    </div>
  );
};
