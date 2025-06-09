import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const UserProfilePage = () => (
  <div className="flex items-start justify-center p-4 sm:p-8">
    <UserProfile 
      path="/users"
      appearance={{
        baseTheme: dark, // You can remove this line if you want it to follow your ThemeProvider
        variables: {
          colorPrimary: '#6366f1', // Indigo to match your theme
        },
        elements: {
          rootBox: 'w-full max-w-5xl',
          card: 'w-full shadow-none border bg-card text-card-foreground',
          navbar: 'hidden', // Hides the inner navbar as we already have a main one
          pageScrollBox: 'p-0 sm:p-4',
          headerTitle: 'text-2xl font-bold text-foreground',
          headerSubtitle: 'text-muted-foreground',
          formFieldLabel: 'text-sm font-medium text-foreground',
          formFieldInput: 'bg-background border-border',
          formButtonPrimary: 'bg-primary hover:bg-primary/90',
          formButtonReset: 'hover:bg-destructive/10 text-destructive',
          accordionTrigger: 'hover:bg-muted/50',
          accordionContent: 'text-muted-foreground',
          profileSection__activeDevices: 'bg-card border-border rounded-lg',
          profileSection__danger: 'bg-card border-border rounded-lg',
          profileSection__account: 'bg-card border-border rounded-lg',
          activeDevice__name: 'text-foreground'
        }
      }}
    />
  </div>
);

export default UserProfilePage;