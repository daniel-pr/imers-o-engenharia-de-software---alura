import { ObjectiveFormData, StudyObjective } from '../types/objective';

const STORAGE_KEY = 'studyflow_objectives_v1';
const INITIAL_SEEDED_KEY = 'studyflow_has_seeded_v1';

/**
 * Exemplos iniciais acolhedores para estudantes iniciantes entenderem a dinâmica
 */
export const SAMPLE_OBJECTIVES: StudyObjective[] = [
  {
    id: 'sample-1',
    titulo: 'Fundamentos de Lógica de Programação',
    descricao: 'Estudar condicionais, laços de repetição (for/while) e resolver 5 exercícios práticos.',
    prazo: getFutureDateString(4),
    status: 'em_andamento',
    criadoEm: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'sample-2',
    titulo: 'Vocabulário Essencial de Inglês Técnico',
    descricao: 'Criar uma lista de 30 palavras comuns no mundo do aprendizado digital e revisar por 15 minutos.',
    prazo: getFutureDateString(10),
    status: 'nao_iniciado',
    criadoEm: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'sample-3',
    titulo: 'Montar Cronograma e Espaço de Estudo',
    descricao: 'Definir horário fixo diário de 45 minutos e separar os materiais de leitura em pastas.',
    prazo: getFutureDateString(-1),
    status: 'concluido',
    criadoEm: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

function getFutureDateString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

/**
 * Serviço responsável pela persistência local dos objetivos
 */
export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage
   */
  getObjectives(): StudyObjective[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const hasSeeded = localStorage.getItem(INITIAL_SEEDED_KEY);

      // Primeiro acesso: fornece exemplos acolhedores para o iniciante
      if (stored === null && !hasSeeded) {
        this.saveObjectives(SAMPLE_OBJECTIVES);
        localStorage.setItem(INITIAL_SEEDED_KEY, 'true');
        return SAMPLE_OBJECTIVES;
      }

      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao recuperar objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Grava a lista completa de objetivos no localStorage
   */
  saveObjectives(objectives: StudyObjective[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(objectives));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo de estudo
   */
  createObjective(data: ObjectiveFormData): StudyObjective {
    const current = this.getObjectives();
    const newObjective: StudyObjective = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `obj_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      titulo: data.titulo.trim(),
      descricao: data.descricao.trim(),
      prazo: data.prazo,
      status: data.status,
      criadoEm: new Date().toISOString(),
    };

    const updated = [newObjective, ...current];
    this.saveObjectives(updated);
    return newObjective;
  },

  /**
   * Atualiza um objetivo existente pelo ID
   */
  updateObjective(id: string, data: ObjectiveFormData): StudyObjective {
    const current = this.getObjectives();
    const index = current.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error(`Objetivo com ID "${id}" não encontrado.`);
    }

    const updatedItem: StudyObjective = {
      ...current[index],
      titulo: data.titulo.trim(),
      descricao: data.descricao.trim(),
      prazo: data.prazo,
      status: data.status,
      atualizadoEm: new Date().toISOString(),
    };

    const updatedList = [...current];
    updatedList[index] = updatedItem;
    this.saveObjectives(updatedList);
    return updatedItem;
  },

  /**
   * Exclui um objetivo do armazenamento
   */
  deleteObjective(id: string): void {
    const current = this.getObjectives();
    const filtered = current.filter((item) => item.id !== id);
    this.saveObjectives(filtered);
  },

  /**
   * Carrega os dados de exemplo novamente se o estudante desejar
   */
  restoreSamples(): StudyObjective[] {
    this.saveObjectives(SAMPLE_OBJECTIVES);
    return SAMPLE_OBJECTIVES;
  },

  /**
   * Remove todos os objetivos cadastrados
   */
  clearAll(): void {
    this.saveObjectives([]);
  },
};
