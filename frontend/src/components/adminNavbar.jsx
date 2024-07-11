import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRightOnRectangleIcon, ArrowUpTrayIcon, UserIcon, CodeBracketIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import logo from "../assets/svg/logo.svg";

export default function AdminNavBar() {
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Upload Problem', icon: ArrowUpTrayIcon, route: '/admin/uploadProblem' },
    { name: 'Contests', icon: ClipboardDocumentListIcon, route: '/admin/contests' },
    { name: 'Problems', icon: CodeBracketIcon, route: '/admin/problems' },
    { name: 'Profile', icon: UserIcon, route: '/admin/profile' },
  ];

  return (
    <header className="bg-white shadow-md">
      <nav className="mx-auto flex items-center justify-between py-3 px-4 lg:px-6" aria-label="Global">
        <div className="flex-1">
          <Link to="/admin/home" className="flex items-center">
            <span className="sr-only">Code Battle</span>
            <img className="h-10 w-auto" src={logo} alt="CodeBattle" />
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-4 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.route}
              className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex flex-col items-center"
            >
              <item.icon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex-1 flex justify-end">
          <button
            onClick={logout}
            className="text-purple-600 hover:text-purple-800 transition-colors duration-200 flex items-center"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
            <span className="text-xs">Log out</span>
          </button>
        </div>
      </nav>
    </header>
  );
}