'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AsciiBackground from '@/components/layout/ascii-background';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setLoading(false);
      if (user) {
        router.push('/app');
      }
    }
    checkUser();
  }, [router]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-black">
      <AsciiBackground />
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8 px-16 pt-16 pb-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">lifeos</h1>
          <p className="mt-2 text-lg text-white/90">an operating system for everyday life.</p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline">
            <Link href="/auth/login">
              enter the matrix <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
