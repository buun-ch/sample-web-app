'use server';

import { db } from '@/src/db';
import { todos } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function getTodos(): Promise<Todo[]> {
  const result = await db.select().from(todos).orderBy(todos.createdAt);
  return result;
}

export async function addTodo(text: string): Promise<void> {
  await db.insert(todos).values({
    text,
  });
  revalidatePath('/');
}

export async function toggleTodo(id: number): Promise<void> {
  const [todo] = await db.select().from(todos).where(eq(todos.id, id)).limit(1);

  if (todo) {
    await db
      .update(todos)
      .set({
        done: !todo.done,
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id));
    revalidatePath('/');
  }
}

export async function updateTodo(id: number, text: string): Promise<void> {
  await db
    .update(todos)
    .set({
      text,
      updatedAt: new Date(),
    })
    .where(eq(todos.id, id));
  revalidatePath('/');
}

export async function deleteTodo(id: number): Promise<void> {
  await db.delete(todos).where(eq(todos.id, id));
  revalidatePath('/');
}
