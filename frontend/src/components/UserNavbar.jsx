import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline'
import logo from "../assets/svg/logo.svg";
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function UserNavbar() {
  const { logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <nav className="mx-auto flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/user/home" className="flex items-center -m-1.5 p-1.5">
            <span className="sr-only">Code Battle</span>
            <img className="h-10 w-auto" src={logo} alt="Logo" />
            <span className="ml-2 text-xl font-bold text-purple-600">Code Battle</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8 lg:ml-auto">
          <Link to="/user/home" className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition duration-150 ease-in-out">
            <HomeIcon className="h-5 w-5 mr-1" />
            Home
          </Link>
          <Link to="/user/contests" className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition duration-150 ease-in-out">
            <ChartPieIcon className="h-5 w-5 mr-1" />
            Contests
          </Link>
          <Link to="/user/profile" className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition duration-150 ease-in-out">
            <UserIcon className="h-5 w-5 mr-1" aria-hidden="true" />
            Profile
          </Link>
          <button onClick={logout} className="flex items-center text-sm font-semibold leading-6 text-gray-900 hover:text-purple-600 transition duration-150 ease-in-out">
            <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" aria-hidden="true" />
            Log out
          </button>
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/user/home" className="-m-1.5 p-1.5">
              <span className="sr-only">Code Battle</span>
              <img className="h-8 w-auto" src={logo} alt="Logo" />
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Link
                  to="/user/home"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  <HomeIcon className="h-6 w-6 mr-2 inline" aria-hidden="true" />
                  Home
                </Link>
                <Link
                  to="/user/contests"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  <ChartPieIcon className="h-6 w-6 mr-2 inline" aria-hidden="true" />
                  Contests
                </Link>
                <Link
                  to="/user/profile"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  <UserIcon className="h-6 w-6 mr-2 inline" aria-hidden="true" />
                  Profile
                </Link>
              </div>
              <div className="py-6">
                <button
                  onClick={logout}
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2 inline" aria-hidden="true" />
                  Log out
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}