import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { notesService, Note } from '../services/notesService';
import toast from 'react-hot-toast';

export default function ReviewPage() {
  const queryClient = useQueryClient();
  const [dueNotes, setDueNotes] = useState<Note[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date>(new Date());

  useEffect(() => {
    loadDueNotes();
  }, []);

  const loadDueNotes = async () => {
    try {
      setLoading(true);
      const notes = await notesService.getDue();
      setDueNotes(notes);
      if (notes.length > 0) {
        setStartTime(new Date());
      }
    } catch (error) {
      toast.error('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    if (currentIndex >= dueNotes.length) return;

    try {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      await notesService.markAsRead(dueNotes[currentIndex].id, timeSpent);
      
      // Invalider le cache des catégories pour mettre à jour les statistiques
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      if (currentIndex + 1 < dueNotes.length) {
        setCurrentIndex(currentIndex + 1);
        setStartTime(new Date());
      } else {
        toast.success('Toutes les notes ont été relues');
        setDueNotes([]);
        setCurrentIndex(0);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-mediumgray">Chargement...</div>
      </div>
    );
  }

  if (dueNotes.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-semibold text-darkgray mb-4">
          Aucune note à relire
        </h1>
        <p className="text-mediumgray mb-8">
          Vous êtes à jour ! Revenez plus tard pour réviser vos notes.
        </p>
        <a
          href="/notes"
          className="inline-block px-6 py-2 bg-cream text-darkgray font-medium hover:opacity-80 transition-opacity"
        >
          Voir mes notes
        </a>
      </div>
    );
  }

  const currentNote = dueNotes[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-semibold text-darkgray">
            Notes à relire
          </h1>
          <span className="text-sm text-mediumgray">
            {currentIndex + 1} / {dueNotes.length}
          </span>
        </div>
        <div className="w-full bg-lightgray h-2">
          <div
            className="bg-cream h-2 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / dueNotes.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="bg-white border border-lightgray p-8 mb-6">
        {currentNote.title && (
          <h2 className="text-xl font-medium text-darkgray mb-4">
            {currentNote.title}
          </h2>
        )}
        
        <div className="text-darkgray whitespace-pre-wrap leading-relaxed mb-6">
          {currentNote.content}
        </div>

        {currentNote.tags && currentNote.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {currentNote.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-lightgray text-darkgray text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-mediumgray pt-4 border-t border-lightgray">
          <div className="space-y-1">
            {currentNote.category && (
              <div className="flex items-center">
                <span className="px-3 py-1 bg-cream text-darkgray text-xs">
                  {currentNote.category.name}
                </span>
              </div>
            )}
          </div>
          <div className="text-right space-y-1">
            <div>Lue {currentNote.readCount} fois</div>
            <div>Dernière lecture : {currentNote.lastReadDate 
              ? new Date(currentNote.lastReadDate).toLocaleDateString('fr-FR')
              : 'Jamais'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-2 text-mediumgray hover:text-darkgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>
        
        <button
          onClick={handleMarkAsRead}
          className="px-8 py-3 bg-cream text-darkgray font-medium hover:opacity-80 transition-opacity"
        >
          Note lue
        </button>

        <button
          onClick={() => setCurrentIndex(Math.min(dueNotes.length - 1, currentIndex + 1))}
          disabled={currentIndex === dueNotes.length - 1}
          className="px-6 py-2 text-mediumgray hover:text-darkgray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}

