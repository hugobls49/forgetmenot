import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const navigation = [
  { name: 'Accueil', href: '/dashboard' },
  { name: 'Mes notes', href: '/notes' },
  { name: 'À relire', href: '/review' },
  { name: 'Catégories', href: '/categories' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      logout();
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-cream border-r border-taupe flex flex-col">
      {/* Logo/Titre en haut */}
      <div className="px-6 py-8 border-b border-taupe">
        <h1 className="text-xl font-semibold text-darkgray tracking-tight">
          ForgetMeNot
        </h1>
      </div>

      {/* Navigation principale */}
      <nav className="px-6 py-8 space-y-2 flex-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm rounded-full transition-colors ${
                isActive
                  ? 'bg-taupe text-darkgray font-medium'
                  : 'text-mediumgray hover:text-darkgray hover:bg-taupe hover:bg-opacity-50'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Profil et actions en bas */}
      <div className="px-6 py-6 border-t border-taupe space-y-3">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-taupe rounded-full text-darkgray font-medium">
            {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-darkgray truncate">
              {user?.firstName || 'Utilisateur'}
            </p>
            <p className="text-xs text-mediumgray truncate">
              {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/settings')}
          className="w-full px-4 py-2 text-sm text-mediumgray hover:text-darkgray hover:bg-taupe hover:bg-opacity-50 rounded-full transition-colors text-left"
        >
          Paramètres
        </button>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 text-sm text-darkgray bg-taupe hover:opacity-90 rounded-full transition-opacity"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

