import { useEffect, useState } from 'react';
import { notesService, Note, NoteStats } from '../services/notesService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<NoteStats | null>(null);
  const [dueNotes, setDueNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, dueNotesData] = await Promise.all([
        notesService.getStats(),
        notesService.getDue(),
      ]);
      setStats(statsData);
      setDueNotes(dueNotesData.slice(0, 5)); // Afficher seulement les 5 premières
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
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
      <h1 className="text-2xl font-semibold text-darkgray mb-8">Accueil</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="bg-taupe bg-opacity-30 p-6 rounded-2xl">
          <div className="text-3xl font-semibold text-darkgray mb-2">
            {stats?.total || 0}
          </div>
          <div className="text-sm text-mediumgray">Notes totales</div>
        </div>
        
        <div className="bg-taupe p-6 rounded-2xl">
          <div className="text-3xl font-semibold text-darkgray mb-2">
            {stats?.dueToday || 0}
          </div>
          <div className="text-sm text-darkgray">À relire aujourd'hui</div>
        </div>
        
        <div className="bg-taupe bg-opacity-30 p-6 rounded-2xl">
          <div className="text-3xl font-semibold text-darkgray mb-2">
            {stats?.readToday || 0}
          </div>
          <div className="text-sm text-mediumgray">Lues aujourd'hui</div>
        </div>
      </div>

      {/* Notes à relire */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-darkgray">
            Notes à relire aujourd'hui
          </h2>
          {dueNotes.length > 0 && (
            <button
              onClick={() => navigate('/review')}
              className="px-6 py-3 bg-taupe text-darkgray font-medium hover:opacity-90 transition-opacity rounded-full"
            >
              Commencer la relecture
            </button>
          )}
        </div>

        {dueNotes.length === 0 ? (
          <div className="bg-taupe bg-opacity-20 p-12 text-center rounded-2xl">
            <p className="text-mediumgray mb-4">
              Aucune note à relire aujourd'hui. Excellent travail !
            </p>
            <button
              onClick={() => navigate('/notes')}
              className="text-darkgray hover:underline font-medium"
            >
              Voir toutes mes notes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {dueNotes.map((note) => (
              <div
                key={note.id}
                className="bg-taupe bg-opacity-30 p-5 hover:bg-opacity-50 transition-all cursor-pointer rounded-2xl"
                onClick={() => navigate('/review')}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {note.title && (
                      <h3 className="font-medium text-darkgray mb-1">
                        {note.title}
                      </h3>
                    )}
                    <p className="text-mediumgray text-sm line-clamp-2">
                      {note.content}
                    </p>
                  </div>
                  <div className="text-xs text-mediumgray ml-4">
                    {formatDate(note.nextReadDate)}
                  </div>
                </div>
                {note.category && (
                  <div className="mt-3">
                    <span className="px-3 py-1 bg-taupe text-darkgray text-xs rounded-full">
                      {note.category.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
            {stats && stats.dueToday > 5 && (
              <div className="text-center py-4">
                <button
                  onClick={() => navigate('/review')}
                  className="text-mediumgray hover:text-darkgray text-sm"
                >
                  Voir les {stats.dueToday - 5} autres notes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

