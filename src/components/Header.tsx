import { NAV_LINKS } from "#/constants/nav-items";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 md:py-6 px-4 md:px-12">
      <h1 role="logo" className="text-2xl font-bold">
        ASMA
      </h1>
      <ul className="flex gap-8">
        {NAV_LINKS.map((link) => (
          <li key={link.path}>
            <Link to={link.path}>{link.name}</Link>
          </li>
        ))}
      </ul>
      <Button>Get Started</Button>
    </header>
  );
}
