import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
      <nav className="flex flex-col w-full space-y-4 font-bold mt-4">
        <NavLink
          className="text-xl w-full p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-center transition-shadow hover:shadow-md"
          to="/"
        >
          Mapping
        </NavLink>

        <NavLink
          className="text-xl w-full p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-center transition-shadow hover:shadow-md"
          to="/memorize"
        >
          Memorize
        </NavLink>

        <NavLink
          className="text-xl w-full p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-center transition-shadow hover:shadow-md"
          to="/test"
        >
          Test
        </NavLink>

        <NavLink
          className="text-xl w-full p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-center transition-shadow hover:shadow-md"
          to="/about"
        >
          About
        </NavLink>
      </nav>
    );
}