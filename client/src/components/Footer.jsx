import { Link } from "react-router";
import { FaFacebook, FaInstagram, FaLinkedin, FaRegCompass } from "react-icons/fa";

const linkClass = "text-gray-600 hover:text-gray-900 hover:underline";
const headingClass = "mb-3 font-semibold text-gray-900";

export default function Footer() {
    return (
        <footer className="border-t border-gray-200 bg-gray-50">
            <div className="mx-auto max-w-screen-2xl px-6 py-12 lg:px-28">
                {/* Top: brand + link columns */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-rose-500">
                            <FaRegCompass className="w-8 h-8" />
                            LumeStay
                        </Link>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-600">
                            Find a stay that feels like home, wherever you&apos;re headed.
                        </p>
                    </div>

                    <div>
                        <h3 className={headingClass}>Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className={linkClass}>Help centre</Link></li>
                            <li><Link to="#" className={linkClass}>Cancellation options</Link></li>
                            <li><Link to="#" className={linkClass}>Safety information</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={headingClass}>Hosting</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/listings/new" className={linkClass}>Airbnb your home</Link></li>
                            <li><Link to="#" className={linkClass}>Hosting resources</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className={headingClass}>LumeStay</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="#" className={linkClass}>About us</Link></li>
                            <li><Link to="#" className={linkClass}>Careers</Link></li>
                            <li><Link to="#" className={linkClass}>Contact</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-sm text-gray-600 md:flex-row">
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
                        <p>&copy; {new Date().getFullYear()} LumeStay Private Limited</p>
                        <Link to="/" className={linkClass}>Privacy</Link>
                        <Link to="/" className={linkClass}>Terms</Link>
                    </div>

                    <div className="flex items-center gap-5 text-xl text-gray-900">
                        <a href="#" className="hover:text-rose-500"><FaFacebook /></a>
                        <a href="#" className="hover:text-rose-500"><FaInstagram /></a>
                        <a href="#" className="hover:text-rose-500"><FaLinkedin /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}