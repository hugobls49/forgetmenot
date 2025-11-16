import api from '../lib/api';

export interface Note {
  id: string;
  title?: string;
  content: string;
  tags: string[];
  userId: string;
  categoryId?: string;
  readCount: number;
  nextReadDate: string;
  lastReadDate?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    color?: string;
  };
  readHistory?: Array<{
    id: string;
    readDate: string;
    timeSpent?: number;
  }>;
}

export interface CreateNoteDto {
  title?: string;
  content: string;
  tags?: string[];
  categoryId?: string;
}

export interface UpdateNoteDto {
  title?: string;
  content?: string;
  tags?: string[];
  categoryId?: string;
}

export interface NoteStats {
  total: number;
  dueToday: number;
  readToday: number;
}

export const notesService = {
  // Créer une nouvelle note
  async create(data: CreateNoteDto): Promise<Note> {
    const response = await api.post('/notes', data);
    return response.data;
  },

  // Obtenir toutes les notes
  async getAll(categoryId?: string): Promise<Note[]> {
    const params = categoryId ? { categoryId } : {};
    const response = await api.get('/notes', { params });
    return response.data;
  },

  // Obtenir les notes à relire
  async getDue(): Promise<Note[]> {
    const response = await api.get('/notes/due');
    return response.data;
  },

  // Obtenir les statistiques
  async getStats(): Promise<NoteStats> {
    const response = await api.get('/notes/stats');
    return response.data;
  },

  // Obtenir une note par ID
  async getById(id: string): Promise<Note> {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  // Mettre à jour une note
  async update(id: string, data: UpdateNoteDto): Promise<Note> {
    const response = await api.patch(`/notes/${id}`, data);
    return response.data;
  },

  // Marquer une note comme lue
  async markAsRead(id: string, timeSpent?: number): Promise<Note> {
    const response = await api.post(`/notes/${id}/read`, { timeSpent });
    return response.data;
  },

  // Supprimer une note
  async delete(id: string): Promise<void> {
    await api.delete(`/notes/${id}`);
  },
};

