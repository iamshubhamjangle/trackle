"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Study",
      icon: BookOpen,
    },
    {
      href: "/manage",
      label: "Manage",
      icon: Settings,
    },
  ];

  return (
    <nav className="bg-background border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8 justify-between w-full">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={30}
              height={30}
              alt="Logo images"
            ></Image>
            <h1 className="text-md font-extrabold">Trackle</h1>
          </div>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.href}
                  variant={isActive ? "default" : "ghost"}
                  size="lg"
                  asChild
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
