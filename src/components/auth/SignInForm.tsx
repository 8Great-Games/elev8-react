import { host } from '../../api/axios';

export default function SignInForm() {
  const handleGoogleLogin = () => {
    window.location.href = `${host}/api/auth/google`;
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto" />
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Sign In
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in with your Google account
          </p>
        </div>
        <div className="space-y-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full gap-3 px-4 py-2 text-sm font-medium text-gray-700 transition bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 488 512"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path
                d="M488 261.8c0-17.8-1.6-35-4.6-51.6H249v97.8h135.5c-5.9 31.6-23.9 58.4-50.8 76.2v63.2h82.1c48-44.3 75.7-109.6 75.7-185.6z"
                fill="#4285F4"
              />
              <path
                d="M249 492c67.3 0 123.7-22.3 165-60.4l-82.1-63.2c-22.8 15.3-51.9 24.4-82.9 24.4-63.8 0-117.8-43-137.2-100.7H27.3v63.8C68.3 438.7 153.7 492 249 492z"
                fill="#34A853"
              />
              <path
                d="M111.8 292.1C106 276.8 102.8 260 102.8 242s3.2-34.8 8.9-50.1V128H27.3C9.7 165.3 0 202.7 0 242s9.7 76.7 27.3 114l84.5-63.9z"
                fill="#FBBC05"
              />
              <path
                d="M249 97.5c35.7 0 67.7 12.3 92.8 36.4l69.6-69.6C368.3 27 312 0 249 0 153.7 0 68.3 53.3 27.3 128l84.5 63.9C131.2 140.5 185.2 97.5 249 97.5z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
