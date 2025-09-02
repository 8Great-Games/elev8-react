
export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28">
      <div className="container mx-auto px-6">
        <h3 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Why Choose Us?
        </h3>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              ⚡ Easy Access
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Access your dashboard anywhere, anytime.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              🔒 Secure
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Your data is protected with enterprise-grade security.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h4 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              🎨 Modern Design
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Clean, responsive, and easy-to-use interface.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
