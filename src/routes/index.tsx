import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <h3 className="mb-4 text-2xl font-bold">Welcome Home!</h3>
      <Button>Click me</Button>
    </div>
  );
}
