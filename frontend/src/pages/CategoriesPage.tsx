import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { categoriesService, CreateCategoryData, UpdateCategoryData, Category } from '../services/categoriesService';

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur invalide'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const colorPresets = [
  '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B',
  '#10B981', '#EF4444', '#6366F1', '#14B8A6',
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      color: '#3B82F6',
    },
  });

  // Réinitialiser le formulaire quand on ouvre/ferme le modal
  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      reset({
        name: category.name,
        color: category.color,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      reset({
        name: '',
        color: '#3B82F6',
        description: '',
      });
    }
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCategory(null);
    reset();
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryData) => categoriesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie créée !');
      closeModal();
    },
    onError: () => {
      toast.error('Erreur lors de la création');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryData }) =>
      categoriesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie mise à jour !');
      closeModal();
    },
    onError: () => {
      toast.error('Erreur lors de la mise à jour');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Catégorie supprimée');
    },
  });

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const selectedColor = watch('color');

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/notes?category=${categoryId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-mediumgray">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-darkgray">Catégories</h1>
          <p className="text-mediumgray mt-1">
            Organisez vos notes par catégories
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-taupe text-darkgray font-medium hover:opacity-90 transition-opacity rounded-full"
        >
          + Nouvelle catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories?.map((category: Category) => (
          <div
            key={category.id}
            className="card group cursor-pointer hover:bg-opacity-80 transition-all"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded-lg"
                  style={{ backgroundColor: category.color }}
                ></div>
                <h3 className="font-semibold text-darkgray">{category.name}</h3>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(category);
                  }}
                  className="text-darkgray hover:text-mediumgray transition-colors"
                  title="Modifier"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Supprimer cette catégorie ?')) {
                      deleteMutation.mutate(category.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors"
                  title="Supprimer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {category.description && (
              <p className="text-sm text-mediumgray mb-3">{category.description}</p>
            )}
            <div className="flex items-center justify-between text-sm text-mediumgray">
              <span>{category._count?.notes || 0} note{category._count?.notes !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ))}
      </div>

      {categories?.length === 0 && (
        <div className="text-center py-16">
          <p className="text-mediumgray mb-4">Aucune catégorie</p>
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-taupe text-darkgray font-medium hover:opacity-90 transition-opacity rounded-full"
          >
            Créer votre première catégorie
          </button>
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {showAddModal && (
        <div className="fixed inset-0 bg-darkgray bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-cream rounded-2xl max-w-md w-full p-8">
            <h2 className="text-xl font-semibold text-darkgray mb-6">
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="input-field"
                  placeholder="Ex: Géographie"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-darkgray mb-2">
                  Couleur *
                </label>
                <div className="flex items-center space-x-3 mb-3">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setValue('color', color)}
                      className={`w-8 h-8 rounded-lg transition-transform ${
                        selectedColor === color ? 'ring-2 ring-offset-2 ring-darkgray scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="text"
                  {...register('color')}
                  className="input-field font-mono"
                  placeholder="#3B82F6"
                />
                {errors.color && (
                  <p className="text-sm text-red-600 mt-1">{errors.color.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-darkgray mb-1">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-2 bg-taupe border-none text-darkgray focus:outline-none focus:ring-2 focus:ring-darkgray resize-none rounded-2xl"
                  placeholder="Description de la catégorie..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-lightgray text-darkgray font-medium hover:opacity-90 transition-opacity rounded-full"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-6 py-3 bg-taupe text-darkgray font-medium hover:opacity-90 transition-opacity rounded-full disabled:opacity-50"
                >
                  {editingCategory
                    ? updateMutation.isPending
                      ? 'Mise à jour...'
                      : 'Mettre à jour'
                    : createMutation.isPending
                    ? 'Création...'
                    : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

