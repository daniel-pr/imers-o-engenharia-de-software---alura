import React from 'react';
import { Calendar, Edit3, Trash2, Check, Clock, PlayCircle } from 'lucide-react';
import { ObjectiveStatus, STATUS_MAP, StudyObjective } from '../types/objective';
import { formatDateBR, getDeadlineStatus } from '../utils/dateUtils';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onRequestDelete: (objective: StudyObjective) => void;
  onUpdateStatus: (id: string, newStatus: ObjectiveStatus) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onRequestDelete,
  onUpdateStatus,
}) => {
  const isCompleted = objective.status === 'concluido';
  const statusConfig = STATUS_MAP[objective.status];
  const deadlineInfo = getDeadlineStatus(objective.prazo, isCompleted);

  const handleNextStatus = () => {
    if (objective.status === 'nao_iniciado') {
      onUpdateStatus(objective.id, 'em_andamento');
    } else if (objective.status === 'em_andamento') {
      onUpdateStatus(objective.id, 'concluido');
    } else {
      onUpdateStatus(objective.id, 'nao_iniciado');
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isCompleted ? 'bg-slate-50/50 opacity-95' : ''
      }`}
    >
      {/* Faixa lateral indicadora de status */}
      <div
        className={`absolute top-0 left-0 bottom-0 w-1.5 ${
          objective.status === 'concluido'
            ? 'bg-emerald-500'
            : objective.status === 'em_andamento'
            ? 'bg-blue-500'
            : 'bg-amber-400'
        }`}
      />

      <div className="p-5 pl-6 flex-1">
        {/* Cabeçalho do Card: Status e Prazo */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {/* Badge de Status com troca rápida ao clicar */}
          <button
            type="button"
            onClick={handleNextStatus}
            title="Clique para alternar o status do objetivo"
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer hover:scale-102 ${statusConfig.badgeClass}`}
          >
            <span className={`w-2 h-2 rounded-full ${statusConfig.dotClass}`} />
            {statusConfig.label}
          </button>

          {/* Badge de Prazo */}
          <div
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border ${deadlineInfo.badgeClass}`}
            title={`Prazo final: ${formatDateBR(objective.prazo)}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{deadlineInfo.text}</span>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base sm:text-lg font-bold text-slate-900 leading-snug break-words ${
            isCompleted ? 'line-through text-slate-500' : ''
          }`}
        >
          {objective.titulo}
        </h3>

        {/* Descrição */}
        {objective.descricao ? (
          <p
            className={`text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line break-words ${
              isCompleted ? 'text-slate-400' : ''
            }`}
          >
            {objective.descricao}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mt-2">
            Nenhuma descrição complementar informada.
          </p>
        )}
      </div>

      {/* Rodapé com Informações de Data e Botões de Ação */}
      <div className="px-5 pl-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Prazo: {formatDateBR(objective.prazo)}</span>
        </div>

        {/* Ações: Concluir rápido, Editar e Excluir */}
        <div className="flex items-center gap-1">
          {/* Botão de Marcar como Concluído / Desfazer */}
          <button
            type="button"
            onClick={() =>
              onUpdateStatus(
                objective.id,
                isCompleted ? 'em_andamento' : 'concluido'
              )
            }
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isCompleted
                ? 'text-emerald-700 hover:bg-emerald-100'
                : 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'
            }`}
            title={
              isCompleted
                ? 'Reabrir objetivo de estudo'
                : 'Marcar objetivo como concluído'
            }
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Botão de Editar */}
          <button
            type="button"
            onClick={() => onEdit(objective)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="Editar objetivo"
            aria-label={`Editar objetivo ${objective.titulo}`}
          >
            <Edit3 className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Botão de Excluir */}
          <button
            type="button"
            onClick={() => onRequestDelete(objective)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Excluir objetivo"
            aria-label={`Excluir objetivo ${objective.titulo}`}
          >
            <Trash2 className="w-4 h-4 stroke-[2]" />
          </button>
        </div>
      </div>
    </div>
  );
};
