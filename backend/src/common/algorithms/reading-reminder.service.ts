import { Injectable } from '@nestjs/common';

/**
 * Service pour gérer les rappels de relecture avec des intervalles fixes
 * Approche simple : plus on lit une note, plus l'intervalle augmente
 */
@Injectable()
export class ReadingReminderService {
  // Intervalles fixes en jours : 1, 3, 7, 14, 30, 60, 90, 180, 365
  private readonly intervals = [1, 3, 7, 14, 30, 60, 90, 180, 365];

  /**
   * Calcule la prochaine date de relecture basée sur le nombre de lectures
   * @param readCount - Nombre de fois que la note a été lue
   * @returns Date de la prochaine relecture
   */
  calculateNextReadDate(readCount: number): Date {
    // Obtenir l'intervalle approprié
    const intervalIndex = Math.min(readCount, this.intervals.length - 1);
    const daysUntilNext = this.intervals[intervalIndex];

    // Calculer la prochaine date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + daysUntilNext);
    nextDate.setHours(0, 0, 0, 0); // Début de la journée

    return nextDate;
  }

  /**
   * Détermine si une note doit être relue aujourd'hui
   * @param nextReadDate - Date de la prochaine relecture
   * @returns true si la note doit être relue
   */
  isDueForReading(nextReadDate: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return nextReadDate <= today;
  }

  /**
   * Obtient l'intervalle en jours pour un nombre de lectures donné
   * @param readCount - Nombre de lectures
   * @returns Intervalle en jours
   */
  getInterval(readCount: number): number {
    const intervalIndex = Math.min(readCount, this.intervals.length - 1);
    return this.intervals[intervalIndex];
  }

  /**
   * Obtient un message descriptif de la fréquence de relecture
   * @param readCount - Nombre de lectures
   * @returns Message descriptif
   */
  getFrequencyMessage(readCount: number): string {
    const interval = this.getInterval(readCount);
    
    if (interval === 1) return 'Tous les jours';
    if (interval <= 7) return `Tous les ${interval} jours`;
    if (interval <= 30) return `Toutes les ${Math.floor(interval / 7)} semaines`;
    if (interval < 365) return `Tous les ${Math.floor(interval / 30)} mois`;
    return 'Une fois par an';
  }
}

