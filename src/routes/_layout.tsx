import {NavLink} from "react-router";
import NewsletterPopup from "@/components/NewsletterPopup.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";

const NavigationLink = ({to, children}: { to: string, children: React.ReactNode }) => {
    return (
        <NavLink to={to} className={({isActive}) =>
            isActive ? "text-red-400" : "text-white"
        }>
            {children}
        </NavLink>
    );
}
export default function DefaultLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-gray-800 text-white p-4">
                <h1 className="text-2xl">pwa-kit-runtime-with-vite-tailwind-shadcn</h1>
                <nav>
                    <ul className="flex space-x-4">
                        <li>
                            <NavigationLink to={"/"}>Home</NavigationLink>
                        </li>
                        <li>
                            <NavigationLink to="/test">Test</NavigationLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="flex-grow">
                <div className="container mx-auto p-4">
                    {children}
                </div>
            </main>
            <footer className="bg-gray-800 text-white p-4">
                <p>&copy; 2024 Example Com</p>
            </footer>
            <NewsletterPopup/>
            <Toaster/>
        </div>
    );
}