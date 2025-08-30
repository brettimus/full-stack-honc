import { Button } from '@/components/ui/button';
import { authClient, type AuthUser } from '@/lib/auth';

export function UserProfile({ user }: { user: AuthUser }) {
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.reload();
        },
      },
    });
  };

  return (
    <div className="flex items-center space-x-3 rounded-lg border bg-card p-2 text-card-foreground">
      {user.image && (
        <img
          src={user.image}
          alt={user.name}
          className="h-8 w-8 rounded-full"
        />
      )}
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold">{user.name}</h4>
        {user.githubUsername && (
          <p className="truncate text-xs text-muted-foreground">
            @{user.githubUsername}
          </p>
        )}
      </div>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
