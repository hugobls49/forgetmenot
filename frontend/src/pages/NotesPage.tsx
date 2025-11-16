import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { notesService, Note, CreateNoteDto } from '../services/notesService';
import { categoriesService, Category } from '../services/categoriesService';
import toast from 'react-hot-toast';

export default function NotesPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<CreateNoteDto>({
    title: '',
    content: '',
    tags: [],
    categoryId: undefined,
  });
  const categoryParam = searchParams.get('category') || '';
  const [filterCategory, setFilterCategory] = useState<string>(categoryParam);

  useEffect(() => {
    // Synchroniser le filtre avec l'URL
    if (categoryParam !== filterCategory) {
      setFilterCategory(categoryParam);
    }
  }, [categoryParam, filterCategory]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notesData, categoriesData] = await Promise.all([
        notesService.getAll(filterCategory || undefined),
        categoriesService.getAll(),
      ]);
      setNotes(notesData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingNote) {
        await notesService.update(editingNote.id, formData);
        toast.success('Note mise à jour');
      } else {
        await notesService.create(formData);
        toast.success('Note créée');
      }
      // Invalider le cache des catégories pour mettre à jour le nombre de notes
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setShowAddModal(false);
      setEditingNote(null);
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title || '',
      content: note.content,
      tags: note.tags,
      categoryId: note.categoryId,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) return;
    try {
      await notesService.delete(id);
      // Invalider le cache des catégories pour mettre à jour le nombre de notes
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Note supprimée');
      loadData();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      tags: [],
      categoryId: undefined,
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-mediumgray">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-darkgray">Mes notes</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingNote(null);
            setShowAddModal(true);
          }}
          className="px-6 py-2 bg-cream text-darkgray font-medium hover:opacity-80 transition-opacity"
        >
          Nouvelle note
        </button>
      </div>

      {/* Filtre par catégorie */}
      <div className="mb-6 flex items-center gap-4">
        <select
          value={filterCategory}
          onChange={(e) => {
            const newCategory = e.target.value;
            setFilterCategory(newCategory);
            // Mettre à jour l'URL
            if (newCategory) {
              setSearchParams({ category: newCategory });
            } else {
              setSearchParams({});
            }
          }}
          className="px-6 py-3 bg-taupe border-none text-darkgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray appearance-none cursor-pointer min-w-[200px]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%232D2D2D' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: 'right 1rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem'
          }}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {filterCategory && (
          <button
            onClick={() => {
              setFilterCategory('');
              setSearchParams({});
            }}
            className="px-4 py-2 text-sm text-mediumgray hover:text-darkgray"
          >
            Effacer le filtre
          </button>
        )}
      </div>

      {/* Liste des notes */}
      <div className="space-y-4">
        {notes.length === 0 ? (
          <div className="text-center py-12 text-mediumgray">
            Aucune note. Créez-en une pour commencer.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white border border-lightgray p-6 hover:border-darkgray transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  {note.title && (
                    <h3 className="text-lg font-medium text-darkgray mb-2">
                      {note.title}
                    </h3>
                  )}
                  <p className="text-mediumgray line-clamp-3">{note.content}</p>
                </div>
                <div className="flex space-x-3 ml-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-mediumgray hover:text-darkgray text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="text-mediumgray hover:text-darkgray text-sm"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-mediumgray">
                <div className="flex items-center space-x-4">
                  {note.category && (
                    <span className="px-3 py-1 bg-cream text-darkgray text-xs">
                      {note.category.name}
                    </span>
                  )}
                  <span>Créée le {formatDate(note.createdAt)}</span>
                  <span>Lue {note.readCount} fois</span>
                </div>
                <div>
                  Prochaine relecture : {formatDate(note.nextReadDate)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal d'ajout/édition */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-darkgray mb-6">
              {editingNote ? 'Modifier la note' : 'Nouvelle note'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm text-darkgray mb-2">
                  Titre (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-lightgray text-darkgray focus:outline-none focus:border-darkgray"
                  placeholder="Un titre pour votre note"
                />
              </div>

              <div>
                <label className="block text-sm text-darkgray mb-2">
                  Contenu *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={8}
                  className="w-full px-4 py-2 border border-lightgray text-darkgray focus:outline-none focus:border-darkgray resize-none"
                  placeholder="Ce que vous voulez retenir..."
                />
              </div>

              <div>
                <label className="block text-sm text-darkgray mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: e.target.value || undefined,
                    })
                  }
                  className="w-full px-6 py-3 bg-taupe border-none text-darkgray rounded-full focus:outline-none focus:ring-2 focus:ring-darkgray appearance-none cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%232D2D2D' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem'
                  }}
                >
                  <option value="">Aucune catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNote(null);
                    resetForm();
                  }}
                  className="px-6 py-2 text-darkgray hover:bg-lightgray transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-cream text-darkgray font-medium hover:opacity-80 transition-opacity"
                >
                  {editingNote ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

