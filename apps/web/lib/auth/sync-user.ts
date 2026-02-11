import { prisma, User } from '@lifeos/db';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export async function syncUser(supabaseUser: SupabaseUser): Promise<User> {
  const { id, email, user_metadata } = supabaseUser;

  if (!email) {
    throw new Error('User email is required for sync');
  }

  // Extract name from user_metadata (populated by OAuth providers)
  const name = user_metadata?.full_name || user_metadata?.name || null;

  // Upsert: create if not exists, update if exists
  const user = await prisma.user.upsert({
    where: { id },
    create: {
      id,
      email,
      name,
    },
    update: {
      email,
      name: name || undefined,
    },
  });

  return user;
}

export async function getUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
