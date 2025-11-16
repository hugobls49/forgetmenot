import { useQuery } from '@tanstack/react-query';
import { statsService } from '../services/statsService';

export default function StatsPage() {
  const currentDate = new Date();
  const { data: progress, isLoading } = useQuery({
    queryKey: ['progress'],
    queryFn: statsService.getProgress,
  });

  const { data: monthlyReport } = useQuery({
    queryKey: ['monthly-report', currentDate.getFullYear(), currentDate.getMonth() + 1],
    queryFn: () => statsService.getMonthlyReport(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1
    ),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-600 mt-1">Analysez vos progrès et performances</p>
      </div>

      {/* Rapport mensuel */}
      {monthlyReport && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Rapport du mois
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary-50 rounded-lg">
              <p className="text-3xl font-bold text-primary-700">
                {monthlyReport.totalReviews}
              </p>
              <p className="text-sm text-gray-600 mt-1">Révisions totales</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-700">
                {monthlyReport.totalTimeMinutes}
              </p>
              <p className="text-sm text-gray-600 mt-1">Minutes d'étude</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-700">
                {monthlyReport.averageTimePerCard}s
              </p>
              <p className="text-sm text-gray-600 mt-1">Temps moyen/carte</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-700">
                {monthlyReport.dailyStats?.length || 0}
              </p>
              <p className="text-sm text-gray-600 mt-1">Jours actifs</p>
            </div>
          </div>
        </div>
      )}

      {/* Distribution de la qualité des réponses */}
      {monthlyReport?.qualityDistribution && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Qualité des réponses
          </h2>
          <div className="space-y-3">
            {Object.entries(monthlyReport.qualityDistribution).map(([quality, count]: [string, any]) => {
              const total = Object.values(monthlyReport.qualityDistribution).reduce(
                (a: any, b: any) => a + b,
                0
              ) as number;
              const percentage = ((count / total) * 100).toFixed(1);
              const labels: Record<string, { text: string; color: string }> = {
                AGAIN: { text: 'À revoir', color: 'bg-red-500' },
                HARD: { text: 'Difficile', color: 'bg-orange-500' },
                GOOD: { text: 'Bon', color: 'bg-green-500' },
                EASY: { text: 'Facile', color: 'bg-blue-500' },
              };

              return (
                <div key={quality}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {labels[quality]?.text || quality}
                    </span>
                    <span className="text-sm text-gray-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${labels[quality]?.color || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Progression par carte */}
      {progress && progress.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Progression détaillée
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Maîtrise
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Révisions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {progress.slice(0, 20).map((card: any) => (
                  <tr key={card.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {card.question.substring(0, 50)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {card.category ? (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: card.category.color }}
                          ></div>
                          <span>{card.category.name}</span>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        card.masteryLevel === 'Maîtrisé' ? 'bg-green-100 text-green-800' :
                        card.masteryLevel === 'Bon' ? 'bg-blue-100 text-blue-800' :
                        card.masteryLevel === 'Révision' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {card.masteryLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            card.mastery >= 80 ? 'bg-green-500' :
                            card.mastery >= 60 ? 'bg-blue-500' :
                            card.mastery >= 40 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${card.mastery}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {card.repetitions}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

