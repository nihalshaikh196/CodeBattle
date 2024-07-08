import { Link } from 'react-router-dom';
import { ArrowUpTrayIcon, UserIcon, CodeBracketIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import AdminNavBar from '../../components/adminNavbar';
function Home() {
  const menuItems = [
    { name: 'Upload Problem', icon: ArrowUpTrayIcon, route: '/admin/uploadProblem' },
    { name: 'Contest', icon: ClipboardDocumentListIcon, route: '/admin/contests' },
    { name: 'Problems', icon: CodeBracketIcon, route: '/problems' },
    { name: 'Profile', icon: UserIcon, route: '/admin/profile' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow">
        
         <AdminNavBar/>
      
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-2xl w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-20">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.route}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out"
              >
                <div className="p-10">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                        <dd className="mt-1 text-lg font-semibold text-gray-900">View</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span className="font-medium text-indigo-600 hover:text-indigo-500">
                      Go to {item.name}
                    </span>
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