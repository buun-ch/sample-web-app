import TodoList from '@/components/TodoList';

// Force dynamic rendering to prevent database connection during build
export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <TodoList />
    </main>
  );
}