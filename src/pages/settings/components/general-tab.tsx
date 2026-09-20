import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-provider';

export function GeneralTab() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDemo = pathname.startsWith('/demo');

  const [darkMode, setDarkMode] = useState(
    () => document.documentElement.classList.contains('dark'),
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  function handleLogout() {
    if (isDemo) {
      window.location.href = '/';
    } else {
      signOut().then(() => navigate('/'));
    }
  }

  return (
    <Card className="[&]:shadow-none">
      <CardContent className="space-y-6 p-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Appearance</h3>
          <div className="mt-4 flex items-center justify-between">
            <Label htmlFor="dark-mode" className="cursor-pointer">
              Dark mode
            </Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-semibold text-foreground">Account</h3>
          <div className="mt-4">
            <Button variant="ghost" className="text-destructive" onClick={handleLogout}>
              Log out of this account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
