'use client';
import React, { useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { User, Users, LogOut, UserCog } from 'lucide-react';
import { UserRole, UserRoleContext } from '@/lib/types';
// import { useAuth } from '@/context/auth-context';

export function UserNav() {
  const { role } = useContext(UserRoleContext);
  // const { user, logout, switchRole } = useAuth();
  
  const roles: UserRole[] = ['leadership', 'admin', 'technical'];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            {/* <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email}`} alt={`@${role}`} /> */}
            <AvatarFallback></AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {/* {user?.name} */}
              </p>
            <p className="text-xs leading-none text-muted-foreground">
              {/* {user?.email} */}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize pt-1">
              Role: {role}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Users className="mr-2 h-4 w-4" />
              <span>Switch Role</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {roles.map((r) => (
                  <DropdownMenuItem key={r} disabled={r === role}>
                    <UserCog className="mr-2 h-4 w-4" />
                    <span className="capitalize">{r}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
        {/* <DropdownMenuItem onSelect={logout}> */}
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
