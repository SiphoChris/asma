import { Link } from "@tanstack/react-router";
import { footerConfig } from "@/constants/footer-items";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-(--line) px-4 pb-14 pt-12 text-(--sea-ink-soft)">
      <div className="mx-auto max-w-6xl">
        {/* Top section — brand + columns */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="mb-2 text-sm font-medium text-(--sea-ink)">{footerConfig.brand.name}</p>
            <p className="mb-6 max-w-xs text-xs leading-relaxed">{footerConfig.brand.tagline}</p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {footerConfig.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-(--sea-ink-soft) transition-colors hover:text-(--sea-ink)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={s.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerConfig.columns.map((col) => (
            <div key={col.heading}>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-(--sea-ink)">
                {col.heading}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => {
                  const Icon = link.icon;
                  const isExternal = link.href.startsWith("http");
                  const inner = (
                    <span className="flex items-center gap-2 text-xs transition-colors hover:text-(--sea-ink)">
                      <Icon size={12} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
                      {link.label}
                    </span>
                  );
                  return (
                    <li key={link.href}>
                      {isExternal ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer">
                          {inner}
                        </a>
                      ) : (
                        <Link to={link.href}>{inner}</Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-(--line) pt-6 text-xs sm:flex-row sm:items-center">
          <span>
            &copy; {year} {footerConfig.legal}
          </span>
          <span className="text-(--sea-ink-soft)/60">Built for South African students</span>
        </div>
      </div>
    </footer>
  );
}
