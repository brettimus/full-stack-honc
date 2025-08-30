import { createFileRoute } from '@tanstack/react-router';
import { useSession } from '@/lib/auth';

export const Route = createFileRoute('/about')({
  component: About,
});

function About() {
  const { data: session } = useSession();
  const user = session?.user;
  const isAuthenticated = !!user;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="mb-4 text-3xl font-bold">About HONC Stack</h1>
        <p className="text-muted-foreground">
          React + Cloudflare Workers + Better Auth
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Tech Stack</h2>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-medium">Frontend</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• React 19</li>
              <li>• TanStack Router</li>
              <li>• TypeScript</li>
              <li>• Tailwind CSS</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Backend</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Cloudflare Workers</li>
              <li>• Hono + D1</li>
              <li>• Drizzle ORM</li>
              <li>• Better Auth</li>
            </ul>
          </div>
        </div>
      </div>

      {isAuthenticated && user && (
        <div className="rounded-lg border bg-muted/50 p-4">
          <h3 className="mb-2 font-semibold">Session Info</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            {user.githubUsername && (
              <p>
                <strong>GitHub:</strong> @{user.githubUsername}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
