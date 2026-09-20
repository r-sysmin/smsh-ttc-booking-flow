import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  IconCalendarEvent,
  IconBook,
  IconClock,
  IconSettings,
  IconLogout,
  IconX,
  type Icon,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { EXIT_DEMO_ROUTE, useIsDemo } from "@/lib/demo";
import { useAuth } from "@/lib/auth/auth-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDataProvider } from "@/lib/data-provider";

interface Tab {
  label: string;
  href: string;
  icon: Icon;
}

const NAV: Tab[] = [
  { label: "Event Types", href: "/event-types", icon: IconCalendarEvent },
  { label: "Bookings", href: "/bookings", icon: IconBook },
  { label: "Availability", href: "/availability", icon: IconClock },
  { label: "Settings", href: "/settings", icon: IconSettings },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function WorkspaceTopBar02() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const dp = useDataProvider();
  const { data: profile } = dp.useProfile();

  // Demo-ness comes from useIsDemo() and nothing else — see src/lib/demo.ts.
  const isDemo = useIsDemo();
  const prefix = isDemo ? "/demo" : "";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between px-4 lg:px-6">
      <Link
        to={`${prefix}/event-types`}
        className="font-heading text-[21px] font-semibold leading-6 tracking-tight text-foreground"
      >
        Meeting Booker
      </Link>

      <nav className="hidden items-center rounded-full bg-background p-1 shadow-sm ring-1 ring-border lg:flex">
        {NAV.map((tab) => {
          const href = `${prefix}${tab.href}`;
          const isActive = pathname.startsWith(href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              to={href}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="Account menu" className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Avatar className="size-8">
              <AvatarImage
                src={profile?.avatar_url ?? undefined}
                alt={profile?.full_name ?? "Account"}
              />
              <AvatarFallback className="text-xs">
                {getInitials(profile?.full_name || "U")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {profile?.full_name && (
              <>
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium text-foreground">
                    {profile.full_name}
                  </p>
                  {profile.username && (
                    <p className="text-xs text-muted-foreground">
                      book/{profile.username}
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={() => navigate(`${prefix}/settings`)}
            >
              <IconSettings className="size-4" />
              Settings
            </DropdownMenuItem>
            {isDemo ? (
              /* The demo has no session, so "Sign out" would be meaningless. Visitors
                 leave via a plain navigation to the marketing landing. */
              <DropdownMenuItem asChild>
                <Link to={EXIT_DEMO_ROUTE}>
                  <IconX className="size-4" />
                  Exit demo
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onSelect={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                <IconLogout className="size-4" />
                Sign out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
