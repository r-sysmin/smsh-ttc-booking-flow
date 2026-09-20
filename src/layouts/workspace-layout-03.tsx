import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  IconCalendarEvent,
  IconBook,
  IconClock,
  IconSettings,
  IconLogout,
  IconLayoutSidebar,
  IconChevronRight,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/auth-provider";

const navItems = [
  { label: "Event Types", href: "/event-types", icon: IconCalendarEvent },
  { label: "Bookings", href: "/bookings", icon: IconBook },
  { label: "Availability", href: "/availability", icon: IconClock },
  { label: "Settings", href: "/settings", icon: IconSettings },
];

function resolveHref(href: string, isDemo: boolean) {
  return isDemo ? `/demo${href}` : href;
}

export default function WorkspaceLayout03() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [breadcrumbDetail, setBreadcrumbDetail] = useState<string | null>(null);
  const { signOut } = useAuth();


  const isDemo = pathname.startsWith("/demo");

  const activeItem = navItems.find((item) =>
    pathname.startsWith(resolveHref(item.href, isDemo))
  );

  const breadcrumbLabel = activeItem?.label ?? "Event Types";

  return (
    <div className="flex h-screen bg-muted">
      <aside
        className={cn(
          "hidden shrink-0 flex-col justify-between p-4 transition-[width] duration-300 lg:flex",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden p-0",
        )}
      >
        <div>
          <Link
            to={resolveHref("/event-types", isDemo)}
            className="mb-8 block px-2 font-heading text-[21px] font-semibold leading-6 tracking-tight text-foreground"
          >
            Meeting Booker
          </Link>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const resolvedHref = resolveHref(item.href, isDemo);
              const isActive = pathname.startsWith(resolvedHref);
              return (
                <Link
                  key={item.href}
                  to={resolvedHref}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-background font-medium text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-border pt-2">
          <button
            onClick={async () => {
              if (isDemo) {
                navigate("/");
              } else {
                await signOut();
                navigate("/");
              }
            }}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconLogout className="size-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden p-0 lg:py-2 lg:pr-2">
        <div className="flex flex-1 flex-col overflow-hidden border border-border bg-background shadow-sm lg:rounded-xl">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle sidebar"
            >
              <IconLayoutSidebar className="size-4" />
            </Button>
            <nav className="flex items-center gap-1 text-sm">
              {activeItem && pathname !== resolveHref(activeItem.href, isDemo) ? (
                <>
                  <Link
                    to={resolveHref(activeItem.href, isDemo)}
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {breadcrumbLabel}
                  </Link>
                  <IconChevronRight className="size-3 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {breadcrumbDetail ?? 'Detail'}
                  </span>
                </>
              ) : (
                <span className="font-medium text-foreground">{breadcrumbLabel}</span>
              )}
            </nav>
          </div>

          <Outlet context={{ setBreadcrumbDetail }} />
        </div>
      </div>
    </div>
  );
}
