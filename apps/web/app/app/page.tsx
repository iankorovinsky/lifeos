import { getCurrentUser } from "@/lib/auth/get-user";

export default async function AppDashboard() {
  const user = await getCurrentUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Welcome{user?.name ? `, ${user.name}` : ""}!
      </h1>
      <p className="mt-2 text-muted-foreground">This is your dashboard.</p>
    </div>
  );
}
