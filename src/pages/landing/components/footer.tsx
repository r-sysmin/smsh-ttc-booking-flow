import { Link } from "react-router-dom";

interface FooterColumn {
  title: string;
  links: { label: string; href: string; external?: boolean }[];
}

const columns: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Demo", href: "/demo/event-types" },
      { label: "Sign in", href: "/auth?intent=signin" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "GitHub", href: "#", external: true },
      { label: "Twitter", href: "#", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto grid max-w-page grid-cols-2 gap-8 px-6 sm:grid-cols-4 lg:px-8">
        <div>
          <Link
            to="/"
            className="font-heading text-[21px] font-semibold leading-6 tracking-tight text-foreground"
          >
            Meeting Booker
          </Link>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-sm font-semibold text-foreground">{col.title}</p>
            <ul className="mt-4 space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
