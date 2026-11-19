import { Link } from "react-router";

const NotFound = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="text-8xl font-bold tracking-tight text-rose-500 sm:text-9xl">404</p>

            <h1 className="mt-4 text-2xl font-semibold text-gray-900 sm:text-3xl">
                Page not found
            </h1>

            <p className="mt-3 max-w-sm leading-relaxed text-gray-600">
                The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                    to="/"
                    className="rounded-xl bg-rose-500 px-6 py-3 text-center font-semibold text-white hover:bg-rose-600"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}

export default NotFound;