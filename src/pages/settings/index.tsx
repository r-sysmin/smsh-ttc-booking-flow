import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from './components/profile-tab';
import { GeneralTab } from './components/general-tab';
import { IntegrationsTab } from './components/integrations-tab';

export default function SettingsPage() {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-3xl space-y-6 py-2">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Settings
        </h2>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="integrations">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
