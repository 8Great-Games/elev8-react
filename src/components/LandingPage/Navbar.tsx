import { useState } from "react";
import ListItem from "./ListItem";
import { toolHost } from "../../api/axios";
const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <header className="absolute left-0 top-0 z-20 flex w-full items-center">
            <div className="container">
                <div className="relative -mx-4 flex items-center justify-between">
                    <div className="w-60 max-w-full px-4">
                        <a href="/#" className="block w-full py-5">
                            <img
                                src="https://cdn.tailgrids.com/assets/images/logo/logo.svg"
                                alt="logo"
                                className="w-full dark:hidden"
                            />
                            <img
                                src="https://cdn.tailgrids.com/assets/images/logo/logo-white.svg"
                                alt="logo"
                                className="w-full hidden dark:block"
                            />
                        </a>
                    </div>

                    <div className="flex w-full items-center justify-between px-4">
                        <div>
                            {/* Navbar toggle button */}
                            <button
                                onClick={() => setOpen(!open)}
                                id="navbarToggler"
                                className={`${open && "navbarTogglerActive"} absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-brand-500 focus:ring-2 lg:hidden`}
                            >
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-gray-900 dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-gray-900 dark:bg-white"></span>
                                <span className="relative my-[6px] block h-[2px] w-[30px] bg-gray-900 dark:bg-white"></span>
                            </button>

                            {/* Navbar items */}
                            <nav
                                id="navbarCollapse"
                                className={`absolute right-4 top-full w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow dark:bg-dark-2 lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none lg:dark:bg-transparent ${!open && "hidden"}`}
                            >
                                <ul className="block lg:flex">
                                    <ListItem NavLink="/#">Home</ListItem>
                                    <ListItem NavLink="/#">Payment</ListItem>
                                    <ListItem NavLink="/#">About</ListItem>
                                    <ListItem NavLink="/#">Blog</ListItem>
                                    {/* Dark mode toggle */}
                                    <li className="flex items-center lg:ml-10 mt-3 lg:mt-0">
                                        <button
                                            onClick={toggleDarkMode}
                                            className="rounded-full bg-gray-200 p-2 dark:bg-gray-700"
                                        >
                                            {darkMode ? (
                                                <span className="text-yellow-400">☀️</span>
                                            ) : (
                                                <span className="text-gray-800">🌙</span>
                                            )}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        <div className="hidden justify-end pr-16 sm:flex lg:pr-0">
                            <a href={`${toolHost}/signin`} className="rounded-lg bg-brand-500 px-7 py-3 text-base font-medium text-white hover:bg-brand-600">
                                Sign in
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;