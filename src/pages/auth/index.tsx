import { Link, Navigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

import { useAuth } from "@/lib/auth/auth-provider";
import { AuthCard } from "./components/auth-card";

export default function AuthPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/event-types" replace />;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link
        to="/"
        className="mb-8 font-heading text-[21px] font-semibold leading-6 tracking-tight text-foreground"
      >
        Meeting Booker
      </Link>

      <AuthCard />

      <div className="mt-6 flex flex-col items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft size={14} />
          Back to home
        </Link>
        <Link
          to="/book/demo"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          View demo
        </Link>
      </div>
    </div>
  );
}
