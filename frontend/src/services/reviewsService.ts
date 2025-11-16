import api from '../lib/api';

export enum ReviewQuality {
  AGAIN = 'AGAIN',
  HARD = 'HARD',
  GOOD = 'GOOD',
  EASY = 'EASY',
}

export interface ReviewData {
  quality: ReviewQuality;
  timeSpent?: number;
}

export const reviewsService = {
  reviewCard: async (cardId: string, data: ReviewData) => {
    const response = await api.post(`/reviews/${cardId}`, data);
    return response.data;
  },

  getHistory: async (cardId?: string) => {
    const url = cardId ? `/reviews?cardId=${cardId}` : '/reviews';
    const response = await api.get(url);
    return response.data;
  },
};

