
export default function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-brand-200 bg-white px-6 py-4 dark:border-brand-800 dark:bg-brand-900">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    MyApp
                </h1>
                <nav className="flex items-center gap-6">
                    <a
                        href="#plans"
                        className="text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-brand-400"
                    >
                        Plans
                    </a>
                    <a
                        href="#features"
                        className="text-gray-700 hover:text-brand-600 dark:text-gray-200 dark:hover:text-brand-400"
                    >
                        Features
                    </a>
                    <a
                        href="/login"
                        className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-500"
                    >
                        Login
                    </a>
                </nav>
            </div>
        </header>
    );
}
