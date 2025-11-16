import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cardsService } from '../services/cardsService';
import { reviewsService, ReviewQuality } from '../services/reviewsService';

export default function ReviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const { data: cards, isLoading } = useQuery({
    queryKey: ['due-cards'],
    queryFn: cardsService.getDue,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ cardId, quality }: { cardId: string; quality: ReviewQuality }) => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      return reviewsService.reviewCard(cardId, { quality, timeSpent });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['due-cards'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['card-statistics'] });
    },
  });

  const handleReview = async (quality: ReviewQuality) => {
    if (!cards || !cards[currentIndex]) return;

    try {
      await reviewMutation.mutateAsync({
        cardId: cards[currentIndex].id,
        quality,
      });

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        setStartTime(Date.now());
      } else {
        toast.success('Révision terminée ! 🎉');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Erreur lors de la révision');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Aucune carte à réviser !
        </h2>
        <p className="text-gray-600 mb-6">
          Vous avez terminé toutes vos révisions pour aujourd'hui.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-primary"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Session de révision</h1>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Carte de révision */}
      <div className="card min-h-[400px] flex flex-col justify-between">
        {/* Catégorie */}
        {currentCard.category && (
          <div className="flex items-center space-x-2 mb-4">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: currentCard.category.color }}
            ></div>
            <span className="text-sm font-medium text-gray-600">
              {currentCard.category.name}
            </span>
          </div>
        )}

        {/* Question */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 mb-6">
              {currentCard.question}
            </p>
            
            {currentCard.hint && !showAnswer && (
              <p className="text-sm text-gray-500 italic">
                💡 Indice : {currentCard.hint}
              </p>
            )}

            {/* Réponse */}
            {showAnswer && (
              <div className="mt-8 p-6 bg-primary-50 rounded-lg animate-slide-in">
                <p className="text-lg text-gray-800">{currentCard.answer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-8">
          {!showAnswer ? (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full btn-primary py-3"
            >
              Voir la réponse
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-gray-700 mb-4">
                Comment avez-vous trouvé cette carte ?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleReview(ReviewQuality.AGAIN)}
                  className="py-3 px-4 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors"
                >
                  ❌ À revoir
                </button>
                <button
                  onClick={() => handleReview(ReviewQuality.HARD)}
                  className="py-3 px-4 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg font-medium transition-colors"
                >
                  😓 Difficile
                </button>
                <button
                  onClick={() => handleReview(ReviewQuality.GOOD)}
                  className="py-3 px-4 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-medium transition-colors"
                >
                  ✅ Bon
                </button>
                <button
                  onClick={() => handleReview(ReviewQuality.EASY)}
                  className="py-3 px-4 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                >
                  😎 Facile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {currentCard.tags && currentCard.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {currentCard.tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

