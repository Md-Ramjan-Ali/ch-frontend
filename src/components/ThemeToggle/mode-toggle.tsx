

"use client"

import { Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative cursor-pointer"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")} // toggle
    >
      {/* Sun */}
      <Sun className={`h-5 w-5 transition-all ${theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`} />
      {/* Moon */}
      <Moon className={`absolute h-5 w-5 transition-all ${theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}










// "use client"

// import { Sun, Moon } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
// import { useTheme } from "./theme-provider"

// export function ModeToggle() {
//   const { setTheme } = useTheme()

//   return (
//     <DropdownMenu.Root>
//       <DropdownMenu.Trigger asChild>
//         <Button variant="outline" size="icon" className="relative cursor-pointer">
//           {/* Sun */}
//           <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//           {/* Moon */}
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenu.Trigger>

//       <DropdownMenu.Content
//         side="bottom"
//         align="end"
//         className="bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 w-32"
//       >
//         <DropdownMenu.Item
//           className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//           onSelect={() => setTheme("light")}
//         >
//           Light
//         </DropdownMenu.Item>
//         <DropdownMenu.Item
//           className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//           onSelect={() => setTheme("dark")}
//         >
//           Dark
//         </DropdownMenu.Item>
//         <DropdownMenu.Item
//           className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
//           onSelect={() => setTheme("system")}
//         >
//           System
//         </DropdownMenu.Item>
//       </DropdownMenu.Content>
//     </DropdownMenu.Root>
//   )
// }












// import { Moon, Sun } from "lucide-react"
 
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useTheme } from "./theme-provider"
  
// export function ModeToggle() {
//   const { setTheme } = useTheme()
 
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon">
//           <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }