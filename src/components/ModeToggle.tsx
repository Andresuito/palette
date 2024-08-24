"use client";

import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="group" size="icon">
          <SunIcon className="h-[1.2rem] w-[1.2rem] opacity-100 dark:opacity-0 transition-all dark:-rotate-90 dark:scale-0 group-hover:scale-105 group-hover:rotate-12 duration-200" />
          <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] opacity-0 dark:opacity-100 transition-all dark:rotate-0 dark:scale-100 group-hover:scale-105 group-hover:rotate-12 duration-200" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
