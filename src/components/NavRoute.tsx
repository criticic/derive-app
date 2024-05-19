// Home Page :=> My Library
// PaperInfo Page :=> My Library / Paper Name (PaperInfo) (ie on clicking My Library, it should take you to the Home Page)
// should automatically update on router

import { Link, useLocation } from "react-router-dom";

export const NavRoute = () => {
    const location = useLocation();

    return (
        <div className="flex items-center text-sm text-gray-500">
            <Link to="/">My Library</Link>
            {location.pathname !== '/' && <span className="ml-1">/   Paper Info</span>}
        </div>
    );
}