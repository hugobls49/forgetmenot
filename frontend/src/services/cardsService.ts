import api from '../lib/api';

export interface Card {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  tags: string[];
  categoryId?: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: string;
  lastReviewed?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

export interface CreateCardData {
  question: string;
  answer: string;
  hint?: string;
  tags?: string[];
  categoryId?: string;
}

export interface UpdateCardData {
  question?: string;
  answer?: string;
  hint?: string;
  tags?: string[];
  categoryId?: string;
}

export const cardsService = {
  getAll: async (filters?: {
    categoryId?: string;
    tags?: string[];
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.tags) filters.tags.forEach((tag) => params.append('tags', tag));
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/cards?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/cards/${id}`);
    return response.data;
  },

  getDue: async () => {
    const response = await api.get('/cards/due');
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/cards/statistics');
    return response.data;
  },

  create: async (data: CreateCardData) => {
    const response = await api.post('/cards', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCardData) => {
    const response = await api.put(`/cards/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  },
};

