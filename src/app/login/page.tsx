'use client';

import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Package2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    if (login(username, password)) {
      router.push('/dashboard');
    } else {
      toast({
        title: 'Invalid Credentials',
        description: 'Please check your username and password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative h-screen w-full">
       <Image
        src="https://picsum.photos/seed/3/1920/1080"
        alt="Inventory management system background"
        fill
        className="object-cover"
        data-ai-hint="warehouse logistics"
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="absolute top-8 left-8 text-white">
          <div className="flex items-center gap-4">
              <Package2 className="size-10 text-primary" />
              <h1 className="text-4xl font-bold font-headline drop-shadow-md">
                  BCCT INVENTORY
              </h1>
          </div>
          <p className="mt-2 text-lg text-white/90 drop-shadow-md">The intelligent way to manage your stock.</p>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <Card className="mx-auto w-[380px] bg-background/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold font-headline">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required 
                 />
              </div>
              <Button type="submit" className="w-full mt-2" onClick={handleLogin}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="#" className="underline">
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
