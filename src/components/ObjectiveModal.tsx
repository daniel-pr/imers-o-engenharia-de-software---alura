import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, AlignLeft, CheckCircle2, HelpCircle } from 'lucide-react';
import { ObjectiveFormData, ObjectiveStatus, StudyObjective } from '../types/objective';

interface ObjectiveModalProps {
  isOpen: boolean;
  editingObjective: StudyObjective | null;
  onClose: () => void;
  onSave: (data: ObjectiveFormData, id?: string) => void;
}

export const ObjectiveModal: React.FC<ObjectiveModalProps> = ({
  isOpen,
  editingObjective,
  onClose,
  onSave,
}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Inicializa os campos quando abrir ou trocar o objetivo em edição
  useEffect(() => {
    if (editingObjective) {
      setTitulo(editingObjective.titulo);
      setDescricao(editingObjective.descricao || '');
      setPrazo(editingObjective.prazo || '');
      setStatus(editingObjective.status || 'nao_iniciado');
    } else {
      // Valores padrão para novo objetivo
      setTitulo('');
      setDescricao('');
      // Sugere data padrão (daqui a 7 dias) se não tiver prazo
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setPrazo(nextWeek.toISOString().split('T')[0]);
      setStatus('nao_iniciado');
    }
    setError(null);
  }, [editingObjective, isOpen]);

  // Tecla ESC para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      setError('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    if (!prazo) {
      setError('Por favor, selecione uma data limite para o prazo.');
      return;
    }

    onSave(
      {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        prazo,
        status,
      },
      editingObjective ? editingObjective.id : undefined
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in zoom-in-95 duration-150">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Target className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-900">
                {editingObjective ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
              </h2>
              <p className="text-xs text-slate-500">
                {editingObjective
                  ? 'Atualize as informações do seu objetivo.'
                  : 'Defina com clareza o que você deseja aprender.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Campo: Título */}
          <div>
            <label
              htmlFor="obj-titulo"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="obj-titulo"
                type="text"
                value={titulo}
                onChange={(e) => {
                  setTitulo(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Ex: Aprender laços for e while em Python"
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder:text-slate-400 transition-colors outline-none"
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Seja específico. Metas claras aumentam as chances de conclusão.
            </p>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label
              htmlFor="obj-descricao"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Descrição / Detalhes <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <div className="relative">
              <textarea
                id="obj-descricao"
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Assistir às aulas 3 e 4 do módulo 2 e resolver a lista com 5 exercícios de fixação."
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 placeholder:text-slate-400 transition-colors outline-none resize-none"
              />
            </div>
          </div>

          {/* Linha dupla: Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: Prazo */}
            <div>
              <label
                htmlFor="obj-prazo"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Prazo Final <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="obj-prazo"
                  type="date"
                  value={prazo}
                  onChange={(e) => {
                    setPrazo(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 transition-colors outline-none"
                />
              </div>
            </div>

            {/* Campo: Status */}
            <div>
              <label
                htmlFor="obj-status"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              >
                Status Atual
              </label>
              <select
                id="obj-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ObjectiveStatus)}
                className="w-full px-3.5 py-2.5 bg-slate-50 focus:bg-white rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-900 transition-colors outline-none cursor-pointer"
              >
                <option value="nao_iniciado">🟡 Não iniciado</option>
                <option value="em_andamento">🔵 Em andamento</option>
                <option value="concluido">🟢 Concluído</option>
              </select>
            </div>
          </div>

          {/* Dica para o estudante iniciante */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-xs text-indigo-900">
            <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Dica pedagógica:</strong> Divida conteúdos grandes em pequenos objetivos diários de 30 a 60 minutos para evitar a sobrecarga.
            </p>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {editingObjective ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
