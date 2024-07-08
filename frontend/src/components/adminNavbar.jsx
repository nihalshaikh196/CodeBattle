import { useAuth } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import logo from "../assets/svg/logo.svg";

export default function AdminNavBar() {
  const { logout } = useAuth();

  return (
    <header className="bg-white">
      <nav className="mx-auto flex items-center justify-between p-3 lg:px-8" aria-label="Global">
        <div className="flex flex-1">
          <span className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-10 w-auto" src={logo} alt="" />
          </span>
        </div>
        <div className="flex flex-1 justify-center">
          <span className="text-purple-600 font-bold text-2xl">Admin</span>
        </div>
        <div className="flex flex-1 justify-end">
          <button
            onClick={logout}
            className="text-gray-900 hover:text-gray-600 transition-colors duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Log out</span>
          </button>
        </div>
      </nav>
    </header>
  );
}