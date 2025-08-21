import { getTodos } from '@/src/actions/todoActions';
import TodoItem from './TodoItem';
import AddTodo from './AddTodo';

export default async function TodoList() {
  const todos = await getTodos();

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        ToDo App
      </h1>

      <AddTodo />

      <div className="space-y-2">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No todos yet. Add one above!
          </p>
        ) : (
          todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>

      {todos.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {todos.filter(t => !t.done).length} of {todos.length} remaining
        </div>
      )}
    </div>
  );
}
