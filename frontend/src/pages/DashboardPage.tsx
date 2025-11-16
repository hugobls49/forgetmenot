import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { statsService } from '../services/statsService';

export default function DashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: statsService.getDashboard,
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
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1">Bienvenue ! Voici votre progression</p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="À réviser aujourd'hui"
          value={stats?.dueToday || 0}
          icon="📝"
          color="bg-blue-50 text-blue-700"
          onClick={() => navigate('/review')}
        />
        <StatCard
          title="Total de cartes"
          value={stats?.totalCards?.total || 0}
          icon="🗂️"
          color="bg-purple-50 text-purple-700"
        />
        <StatCard
          title="Cartes maîtrisées"
          value={stats?.totalCards?.mastered || 0}
          icon="✨"
          color="bg-green-50 text-green-700"
        />
        <StatCard
          title="Série actuelle"
          value={`${stats?.streak || 0} jours`}
          icon="🔥"
          color="bg-orange-50 text-orange-700"
        />
      </div>

      {/* Révisions du jour */}
      {stats?.dueToday > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Révisions du jour
            </h2>
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
              {stats.dueToday} cartes
            </span>
          </div>
          <p className="text-gray-600 mb-4">
            Vous avez {stats.dueToday} carte(s) à réviser aujourd'hui. Commencez dès maintenant pour maintenir votre progression !
          </p>
          <button
            onClick={() => navigate('/review')}
            className="btn-primary"
          >
            Commencer la révision
          </button>
        </div>
      )}

      {/* Progression hebdomadaire */}
      {stats?.weeklyStats && stats.weeklyStats.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Activité de la semaine
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {stats.weeklyStats.map((day: any, index: number) => (
              <div key={index} className="text-center">
                <div
                  className={`h-16 rounded-lg flex items-center justify-center ${
                    day.reviewed > 0
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <span className="font-bold">{day.reviewed}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statistiques par catégorie */}
      {stats?.categoryStats && stats.categoryStats.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Cartes par catégorie
          </h2>
          <div className="space-y-3">
            {stats.categoryStats.map((category: any) => (
              <div key={category.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <span className="text-gray-600">{category.totalCards} cartes</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message de motivation */}
      {stats?.streak > 0 && (
        <div className="card bg-gradient-to-r from-primary-500 to-secondary-600 text-white">
          <h3 className="text-xl font-bold mb-2">
            🎉 Excellent travail !
          </h3>
          <p>
            Vous avez maintenu une série de {stats.streak} jour(s) ! Continuez comme ça pour atteindre vos objectifs.
          </p>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onClick?: () => void;
}

function StatCard({ title, value, icon, color, onClick }: StatCardProps) {
  return (
    <div
      className={`card ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-4xl p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

