import { useState } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import logo from '../assets/svg/logo.svg';

import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export default function ProblemNavBar({ ProblemName }) {
  const {  logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-purple-500">
      <nav className="mx-auto flex items-center justify-between p-2 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <span  className="-m-1.5 p-1.5">
            <span className="sr-only">Your Company</span>
            <img className="h-10 w-auto" src={logo} alt="Logo" />
          </span>
           <Link to="/user/home" className="flex items-center ml-5 text-m font-semibold leading-6 text-white">
            Home
          </Link>
        </div>
        <div className="hidden lg:flex lg:justify-center lg:flex-1">
          <h1 className="text-xl font-semibold text-white">{ProblemName}</h1>
        </div>
        <div  className="hidden lg:flex lg:flex-1 lg:justify-end">
          <span className="text-gray-900">
            <ArrowRightOnRectangleIcon onClick={logout} className="h-6 w-6 text-white" aria-hidden="true" />
            <span className="sr-only">Log out</span>
          </span>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6 text-white" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img className="h-8 w-auto" src={logo} alt="Logo" />
            </a>
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
              <div onClick={logout} className=" py-6">
                
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-2 inline text-white" aria-hidden="true" />
                  Log out
                
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

ProblemNavBar.propTypes = {
  ProblemName: PropTypes.string.isRequired,
};