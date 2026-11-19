import { BiErrorCircle } from "react-icons/bi";
import { Link } from "react-router";

const ErrorPage = () => {
    return (
        <div className="flex flex-1 items-center justify-center px-6 py-16">
            <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-50">
                    <BiErrorCircle className="h-10 w-10 text-rose-500" />
                </div>

                <h1 className="mt-6 text-2xl font-semibold text-gray-900 sm:text-3xl">
                    Something went wrong!
                </h1>

                <p className="mx-auto mt-3 max-w-sm leading-relaxed text-gray-600">
                    An unexpected error happened on our side. Try going back to the home page.
                </p>

                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                    <Link
                        to="/"
                        className="rounded-xl bg-rose-500 px-6 py-3 text-center font-semibold text-white hover:bg-rose-600"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ErrorPage;