import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { FilterControls } from './components/FilterControls';
import { ObjectiveCard } from './components/ObjectiveCard';
import { ObjectiveModal } from './components/ObjectiveModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { EmptyState } from './components/EmptyState';
import { storageService } from './services/storageService';
import {
  ObjectiveFilter,
  ObjectiveFormData,
  ObjectiveStatus,
  SortOption,
  StudyObjective,
} from './types/objective';
import { CheckCircle, AlertCircle, Plus, Sparkles, BookOpen } from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState<ObjectiveFilter>('todos');
  const [sortOption, setSortOption] = useState<SortOption>('prazo_asc');

  // Controle de Modais
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObjective, setEditingObjective] = useState<StudyObjective | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudyObjective | null>(null);

  // Mensagem temporária de notificação (Toast)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Carrega os dados do localStorage na inicialização da página
  useEffect(() => {
    const loaded = storageService.getObjectives();
    setObjectives(loaded);
  }, []);

  // Abrir modal para novo objetivo
  const handleOpenNewModal = () => {
    setEditingObjective(null);
    setIsModalOpen(true);
  };

  // Abrir modal para editar objetivo
  const handleOpenEditModal = (objective: StudyObjective) => {
    setEditingObjective(objective);
    setIsModalOpen(true);
  };

  // Fechar modal de criação/edição
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingObjective(null);
  };

  // Salvar (Criar ou Atualizar)
  const handleSaveObjective = (data: ObjectiveFormData, id?: string) => {
    try {
      if (id) {
        // Atualização
        storageService.updateObjective(id, data);
        showToast('Objetivo atualizado com sucesso!', 'success');
      } else {
        // Criação
        storageService.createObjective(data);
        showToast('Novo objetivo de estudo cadastrado!', 'success');
      }
      // Atualiza o estado lendo a versão persistida
      setObjectives(storageService.getObjectives());
      handleCloseModal();
    } catch (error) {
      console.error(error);
      showToast('Ocorreu um erro ao salvar o objetivo.', 'info');
    }
  };

  // Solicitar exclusão (abre confirmação)
  const handleRequestDelete = (objective: StudyObjective) => {
    setDeleteTarget(objective);
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    try {
      storageService.deleteObjective(deleteTarget.id);
      setObjectives(storageService.getObjectives());
      showToast(`"${deleteTarget.titulo}" foi removido com sucesso.`, 'info');
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteTarget(null);
    }
  };

  // Alteração direta de status
  const handleUpdateStatus = (id: string, newStatus: ObjectiveStatus) => {
    const target = objectives.find((o) => o.id === id);
    if (!target) return;

    storageService.updateObjective(id, {
      titulo: target.titulo,
      descricao: target.descricao,
      prazo: target.prazo,
      status: newStatus,
    });

    setObjectives(storageService.getObjectives());

    if (newStatus === 'concluido') {
      showToast('Parabéns! Mais um objetivo concluído! 🎉', 'success');
    }
  };

  // Carregar exemplos pedagógicos
  const handleLoadSamples = () => {
    const samples = storageService.restoreSamples();
    setObjectives(samples);
    showToast('Exemplos de estudo carregados com sucesso!', 'info');
  };

  // Filtragem e Ordenação
  const filteredAndSortedObjectives = useMemo(() => {
    let result = [...objectives];

    // 1. Filtro por status
    if (currentFilter !== 'todos') {
      result = result.filter((item) => item.status === currentFilter);
    }

    // 2. Filtro por busca de texto (título e descrição)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.titulo.toLowerCase().includes(q) ||
          (item.descricao && item.descricao.toLowerCase().includes(q))
      );
    }

    // 3. Ordenação
    result.sort((a, b) => {
      if (sortOption === 'prazo_asc') {
        if (!a.prazo) return 1;
        if (!b.prazo) return -1;
        return a.prazo.localeCompare(b.prazo);
      }
      if (sortOption === 'prazo_desc') {
        if (!a.prazo) return 1;
        if (!b.prazo) return -1;
        return b.prazo.localeCompare(a.prazo);
      }
      if (sortOption === 'alfabetica') {
        return a.titulo.localeCompare(b.titulo);
      }
      if (sortOption === 'recentes') {
        return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
      }
      return 0;
    });

    return result;
  }, [objectives, currentFilter, searchQuery, sortOption]);

  const isFilterActive = currentFilter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col font-sans">
      {/* Notificação Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-indigo-600 text-white border-indigo-500'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-indigo-200" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <Header
        totalCount={objectives.length}
        onOpenNewModal={handleOpenNewModal}
      />

      {/* Conteúdo Principal */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* Painel de Estatísticas e Progresso */}
        <StatsOverview
          objectives={objectives}
          onSelectFilter={(status) => setCurrentFilter(status)}
          currentFilter={currentFilter}
        />

        {/* Barra de Filtros, Pesquisa e Ordenação */}
        {objectives.length > 0 && (
          <FilterControls
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            sortOption={sortOption}
            onSortChange={setSortOption}
            objectives={objectives}
          />
        )}

        {/* Listagem de Objetivos */}
        <section aria-label="Lista de Objetivos de Estudo">
          {objectives.length === 0 ? (
            <EmptyState
              isFiltered={false}
              onOpenNewModal={handleOpenNewModal}
              onLoadSamples={handleLoadSamples}
            />
          ) : filteredAndSortedObjectives.length === 0 ? (
            <EmptyState
              isFiltered={true}
              onOpenNewModal={handleOpenNewModal}
              onClearFilter={() => {
                setSearchQuery('');
                setCurrentFilter('todos');
              }}
            />
          ) : (
            <div>
              {/* Indicador de contagem visível dos itens filtrados */}
              <div className="flex items-center justify-between mb-4 px-1">
                <span className="text-xs sm:text-sm font-semibold text-slate-600">
                  Mostrando {filteredAndSortedObjectives.length}{' '}
                  {filteredAndSortedObjectives.length === 1
                    ? 'objetivo de estudo'
                    : 'objetivos de estudo'}
                  {isFilterActive && ' (filtrados)'}
                </span>

                {isFilterActive && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentFilter('todos');
                    }}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>

              {/* Grid de Cartões de Objetivos */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAndSortedObjectives.map((objective) => (
                  <ObjectiveCard
                    key={objective.id}
                    objective={objective}
                    onEdit={handleOpenEditModal}
                    onRequestDelete={handleRequestDelete}
                    onUpdateStatus={handleUpdateStatus}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modal de Criação / Edição */}
      <ObjectiveModal
        isOpen={isModalOpen}
        editingObjective={editingObjective}
        onClose={handleCloseModal}
        onSave={handleSaveObjective}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        isOpen={deleteTarget !== null}
        objective={deleteTarget}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Rodapé Acolhedor */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">StudyFlow</span>
            <span>•</span>
            <span>Feito para apoiar estudantes no início de sua jornada</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Dados salvos no seu navegador (localStorage)
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
