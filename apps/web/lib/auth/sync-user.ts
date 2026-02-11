import { prisma } from "@lifeos/db";

// Minimal Supabase user interface for syncing
interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
  };
}

export interface SyncedUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function syncUser(supabaseUser: SupabaseUser): Promise<SyncedUser> {
  const { id, email, user_metadata } = supabaseUser;

  if (!email) {
    throw new Error("User email is required for sync");
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

export async function getUserById(id: string): Promise<SyncedUser | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}
