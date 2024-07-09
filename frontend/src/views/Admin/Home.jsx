import { Link } from 'react-router-dom';
import { ArrowUpTrayIcon, UserIcon, CodeBracketIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import AdminNavBar from '../../components/adminNavbar';

function Home() {
  const menuItems = [
    { name: 'Upload Problem', icon: ArrowUpTrayIcon,text:'Upload a new problem', route: '/admin/uploadProblem', color: 'bg-blue-500' },
    { name: 'Contest', icon: ClipboardDocumentListIcon,text:'View, Schedule and Update Contest', route: '/admin/contests', color: 'bg-green-500' },
    { name: 'Problems', icon: CodeBracketIcon,text:'View and edit Problems', route: '/admin/problems', color: 'bg-yellow-500' },
    { name: 'Profile', icon: UserIcon,text:'Admin Details', route: '/admin/profile', color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col">
      <header className="bg-white shadow-md">
        <AdminNavBar />
      </header>
      <main className="flex-grow flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-bold text-center mb-12 text-purple-600">Admin Dashboard</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.route}
                className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 ${item.color} rounded-lg p-4`}>
                      <item.icon className="h-8 w-8 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                      <p className="mt-1 text-sm text-gray-500">{item.text}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4">
                  <div className="group flex items-center text-sm font-medium text-indigo-600">
                    <span>Go to {item.name}</span>
                    <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;