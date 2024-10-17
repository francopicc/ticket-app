"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleNavigation = (path) => {
    router.push(path);
    setDropdownOpen(false);
  };

  const handleSignOut = () => {
    signOut();
    setDropdownOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-[10em] py-4">
      <div>
        <h1 className="text-lg font-bold">Ticket App</h1>
      </div>
      <div className="relative">
        <img
          src={session?.user?.image}
          width={35}
          className="rounded-full object-cover cursor-pointer"
          onClick={toggleDropdown}
          alt="User Profile"
        />

        {/* Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10"
            >
              <ul className="flex flex-col text-left">
                <li
                  onClick={() => handleNavigation("/profile")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Perfil
                </li>
                <li
                  onClick={() => handleNavigation("/profile/settings")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Configuración
                </li>
                <li
                  onClick={() => handleNavigation("/my-tickets")}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Mis Entradas
                </li>
                <li
                  onClick={handleSignOut}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
                >
                  Cerrar Sesión
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
