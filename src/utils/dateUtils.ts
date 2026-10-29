/**
 * Utilitários para formatação e manipulação de datas em português do Brasil
 */

export function formatDateBR(dateString: string): string {
  if (!dateString) return 'Sem prazo definido';
  try {
    // Garante que a data YYYY-MM-DD seja interpretada no fuso local sem deslocamento de dia
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;

    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export interface DeadlineStatus {
  text: string;
  isUrgent: boolean;
  isOverdue: boolean;
  badgeClass: string;
}

export function getDeadlineStatus(dateString: string, isCompleted: boolean): DeadlineStatus {
  if (isCompleted) {
    return {
      text: 'Concluído no prazo',
      isUrgent: false,
      isOverdue: false,
      badgeClass: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    };
  }

  if (!dateString) {
    return {
      text: 'Sem data limite',
      isUrgent: false,
      isOverdue: false,
      badgeClass: 'text-slate-600 bg-slate-100 border-slate-200',
    };
  }

  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const deadline = new Date(year, month - 1, day);
    deadline.setHours(23, 59, 59, 999);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const daysOverdue = Math.abs(diffDays);
      return {
        text: daysOverdue === 1 ? 'Venceu ontem' : `Vencido há ${daysOverdue} dias`,
        isUrgent: true,
        isOverdue: true,
        badgeClass: 'text-rose-700 bg-rose-50 border-rose-200 font-medium',
      };
    }

    if (diffDays === 0) {
      return {
        text: 'Vence hoje!',
        isUrgent: true,
        isOverdue: false,
        badgeClass: 'text-amber-700 bg-amber-50 border-amber-200 font-medium',
      };
    }

    if (diffDays === 1) {
      return {
        text: 'Vence amanhã',
        isUrgent: true,
        isOverdue: false,
        badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    }

    if (diffDays <= 3) {
      return {
        text: `Faltam ${diffDays} dias`,
        isUrgent: true,
        isOverdue: false,
        badgeClass: 'text-amber-700 bg-amber-50 border-amber-200',
      };
    }

    return {
      text: `Em ${diffDays} dias`,
      isUrgent: false,
      isOverdue: false,
      badgeClass: 'text-slate-600 bg-slate-100 border-slate-200',
    };
  } catch {
    return {
      text: dateString,
      isUrgent: false,
      isOverdue: false,
      badgeClass: 'text-slate-600 bg-slate-100 border-slate-200',
    };
  }
}
