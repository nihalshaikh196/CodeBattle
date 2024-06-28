import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import logo from "../assets/svg/logo.svg";
import {Link} from "react-router-dom";
import PropTypes from 'prop-types';

export default function AuthNavbar({AuthMode}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white">
      <nav className="mx-auto flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <span className="-m-1.5 p-1.5">
            <span className="sr-only">Code Battle</span>
            <img className="h-10 w-auto" src={logo} alt="" />
          </span>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          
          <span className="text-2xl font-bold font-mono  leading-6 text-purple-600">
            Code Battle
          </span>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <span className="text-sm font-semibold leading-6 text-gray-900">
            <Link to={AuthMode === 0 ? "/auth/register" : "/auth/login"}>
              {AuthMode === 0 ? "Sign Up" : "Log In"}
            </Link>
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </nav>
      <Dialog className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <span  className="-m-1.5 p-1.5">
              <span className="sr-only">Code Battle</span>
              <img
                className="h-8 w-auto"
                src={logo}
                alt=""
              />
            </span>
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
              
              <div className="py-6">
                <span
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  <Link to={AuthMode === 0 ? "/auth/register" : "/auth/login"}>
                    {AuthMode === 0 ? "Sign Up" : "Log In"}
                  </Link>
                  
                </span>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}

AuthNavbar.propTypes = {
  AuthMode: PropTypes.number.isRequired,
};