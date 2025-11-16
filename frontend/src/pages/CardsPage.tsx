import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { cardsService, CreateCardData } from '../services/cardsService';
import { categoriesService } from '../services/categoriesService';

const cardSchema = z.object({
  question: z.string().min(1, 'La question est requise'),
  answer: z.string().min(1, 'La réponse est requise'),
  hint: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
});

type CardFormData = z.infer<typeof cardSchema>;

export default function CardsPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: cards, isLoading } = useQuery({
    queryKey: ['cards', selectedCategory, searchTerm],
    queryFn: () => cardsService.getAll({
      categoryId: selectedCategory || undefined,
      search: searchTerm || undefined,
    }),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateCardData) => cardsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Carte créée avec succès !');
      setShowAddModal(false);
      reset();
    },
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cardsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] });
      toast.success('Carte supprimée');
    },
  });

  const onSubmit = (data: CardFormData) => {
    const cardData: CreateCardData = {
      question: data.question,
      answer: data.answer,
      hint: data.hint,
      categoryId: data.categoryId || undefined,
      tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
    };
    createMutation.mutate(cardData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes cartes</h1>
          <p className="text-gray-600 mt-1">
            {cards?.length || 0} carte(s) au total
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          + Nouvelle carte
        </button>
      </div>

      {/* Filtres */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              placeholder="Rechercher dans les cartes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              <option value="">Toutes les catégories</option>
              {categories?.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Liste des cartes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards?.map((card: any) => (
          <div key={card.id} className="card group">
            {card.category && (
              <div className="flex items-center space-x-2 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: card.category.color }}
                ></div>
                <span className="text-xs font-medium text-gray-600">
                  {card.category.name}
                </span>
              </div>
            )}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {card.question}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {card.answer}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                Révisions: {card.repetitions}
              </span>
              <button
                onClick={() => {
                  if (confirm('Supprimer cette carte ?')) {
                    deleteMutation.mutate(card.id);
                  }
                }}
                className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {cards?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">Aucune carte trouvée</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Créer votre première carte
          </button>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Nouvelle carte
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question *
                </label>
                <textarea
                  {...register('question')}
                  rows={3}
                  className="input-field"
                  placeholder="Quelle est la question ?"
                />
                {errors.question && (
                  <p className="text-sm text-red-600 mt-1">{errors.question.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Réponse *
                </label>
                <textarea
                  {...register('answer')}
                  rows={3}
                  className="input-field"
                  placeholder="Quelle est la réponse ?"
                />
                {errors.answer && (
                  <p className="text-sm text-red-600 mt-1">{errors.answer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Indice (optionnel)
                </label>
                <input
                  type="text"
                  {...register('hint')}
                  className="input-field"
                  placeholder="Un indice pour vous aider..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select {...register('categoryId')} className="input-field">
                  <option value="">Aucune catégorie</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (séparés par des virgules)
                </label>
                <input
                  type="text"
                  {...register('tags')}
                  className="input-field"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    reset();
                  }}
                  className="flex-1 btn-secondary"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 btn-primary"
                >
                  {createMutation.isPending ? 'Création...' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

