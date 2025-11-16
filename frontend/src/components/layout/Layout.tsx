import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 py-8 px-6 ml-32 bg-cream flex justify-center">
          <div className="w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

