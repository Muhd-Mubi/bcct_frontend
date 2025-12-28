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
    <div className="relative h-screen w-full font-body">
       <Image
        src="https://picsum.photos/seed/3/1920/1080"
        alt="Inventory management system background"
        fill
        className="object-cover blur-sm"
        data-ai-hint="warehouse logistics"
      />
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="absolute top-8 left-8 text-white">
          <div className="flex items-center gap-4">
              <Package2 className="size-8 text-primary" />
              <h1 className="text-2xl font-bold font-headline drop-shadow-md">
                  BCCT INVENTORY
              </h1>
          </div>
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <Card className="mx-auto w-[380px] border-none bg-glass backdrop-blur-md text-card-foreground shadow-modal">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline">Welcome Back</CardTitle>
            <CardDescription className="text-white/80">
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-white/90">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="bg-background/20 text-white placeholder:text-white/60 border-white/20 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white/90">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm text-white/70 hover:text-white underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="password"
                  required 
                  className="bg-background/20 text-white placeholder:text-white/60 border-white/20 focus:border-primary focus:ring-primary"
                 />
              </div>
              <Button type="submit" className="w-full mt-2" onClick={handleLogin}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
