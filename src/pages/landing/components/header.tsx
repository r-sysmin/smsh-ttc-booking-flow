import { Link } from "react-router-dom";
import { Button } from "@/components/base/button";

function Wordmark() {
  return (
    <Link
      to="/"
      className="font-heading text-[21px] font-semibold leading-6 tracking-tight text-foreground"
    >
      Meeting Booker
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-6 lg:px-8">
        <Wordmark />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/demo/event-types">See demo</Link>
          </Button>
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link to="/auth?intent=signin">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?intent=signup">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
