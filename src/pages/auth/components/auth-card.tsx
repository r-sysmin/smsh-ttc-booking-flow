import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";

import { supabase } from "@/integrations/supabase/client";

import { Button } from "@/components/base/button";
import { SocialAuthButtons } from "@/components/base/social-auth-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type AuthView = "tabs" | "forgot-password" | "check-email" | "reset-sent";

export function AuthCard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const intentParam = searchParams.get("intent");
  const defaultTab = intentParam === "signup" ? "signup" : "signin";


  const [view, setView] = useState<AuthView>("tabs");
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const [resetEmail, setResetEmail] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });
    if (error) {
      if (error.message.includes("Email not confirmed")) {
        toast.error("Email not yet confirmed — check your inbox");
      } else {
        toast.error("Invalid email or password");
      }
      setLoading(false);
      return;
    }
    navigate("/event-types");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signUpEmail,
      password: signUpPassword,
      options: {
        data: { full_name: signUpName },
        // Confirmation links must return to /auth/callback — that is the only route
        // that can exchange the code for a session. A bare origin (or the Supabase
        // default Site URL) drops the new user on the marketing landing, signed out.
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("Email already registered");
      } else {
        toast.error(error.message);
      }
      setLoading(false);
      return;
    }
    setConfirmEmail(signUpEmail);
    setView("check-email");
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Recovery links deliberately return to /auth, NOT /auth/callback: the callback
    // establishes a session and drops you straight into the app, which would skip the
    // chance to choose a new password.
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    setView("reset-sent");
    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: confirmEmail,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Confirmation email resent");
    }
    setLoading(false);
  };

  if (view === "check-email") {
    return (
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a confirmation link to{" "}
            <span className="font-medium text-foreground">{confirmEmail}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResendConfirmation}
            disabled={loading}
          >
            {loading && <IconLoader2 className="animate-spin" />}
            Resend email
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (view === "forgot-password") {
    return (
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we'll send a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <IconLoader2 className="animate-spin" />}
              Send reset link
            </Button>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setView("tabs")}
            >
              Back to sign in
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (view === "reset-sent") {
    return (
      <Card className="w-full max-w-[400px]">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            Check your email for a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => {
              setView("tabs");
              setActiveTab("signin");
            }}
          >
            Back to sign in
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[400px]">
      <CardHeader>
        <CardTitle>
          {activeTab === "signin" ? "Welcome back" : "Create your account"}
        </CardTitle>
        <CardDescription>
          {activeTab === "signin"
            ? "Sign in to your scheduling dashboard"
            : "Set up your scheduling page in minutes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* The ONE brand-compliant SSO button set. Do not restyle or rebuild
            inline — see docs/design/auth.md. Google is the only provider this
            project has configured, so it is the only one passed. */}
        <SocialAuthButtons
          mode={activeTab === "signup" ? "signup" : "signin"}
          providers={["google"]}
        />

        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="signin" className="flex-1">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">
              Sign up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;&#x2022;"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="self-end text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => {
                    setResetEmail(signInEmail);
                    setView("forgot-password");
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <IconLoader2 className="animate-spin" />}
                Sign in
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-name">Full name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Alex Morgan"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <IconLoader2 className="animate-spin" />}
                Create account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
