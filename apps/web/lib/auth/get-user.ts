import { createClient } from "@/lib/supabase/server";
import { getUserById, syncUser } from "./sync-user";
import type { SyncedUser } from "./sync-user";

export async function getCurrentUser(): Promise<SyncedUser | null> {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    return null;
  }

  // Try to get user from database
  let user = await getUserById(supabaseUser.id);

  // If not found, sync and return
  if (!user) {
    user = await syncUser(supabaseUser);
  }

  return user;
}
