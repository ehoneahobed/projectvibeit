"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="border-green-200 dark:border-green-700 hover:bg-green-50 dark:hover:bg-green-900/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-200"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-green-600 dark:text-green-400" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-green-600 dark:text-green-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white/95 dark:bg-green-950/95 backdrop-blur-sm border-green-200 dark:border-green-800"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 focus:bg-green-50 dark:focus:bg-green-900/50"
        >
          <Sun className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 focus:bg-green-50 dark:focus:bg-green-900/50"
        >
          <Moon className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/50 focus:bg-green-50 dark:focus:bg-green-900/50"
        >
          <div className="w-4 h-4 mr-2 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-green-600 dark:border-green-400 rounded-full" />
          </div>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 