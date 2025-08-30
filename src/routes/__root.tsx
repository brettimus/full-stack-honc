import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { UserProfile } from '@/components/UserProfile';
import { useSession } from '@/lib/auth';

function RootComponent() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold">🪿 HONC Stack</h1>
              <span className="text-sm text-muted-foreground">
                React + Cloudflare + Better Auth
              </span>
            </div>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium transition-colors hover:text-primary [&.active]:text-primary"
              >
                About
              </Link>
            </nav>
          </div>

          {isAuthenticated && user && <UserProfile user={user} />}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
