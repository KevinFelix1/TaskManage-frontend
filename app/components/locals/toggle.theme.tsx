import { useState, useEffect, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "~/components/ui/dropdown-menu";

const ToggleTheme = () => {
  const [theme, setTheme] = useState<string>("system");

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log(theme);
      // El código dentro de este bloque solo se ejecutará en el navegador
      const savedTheme = localStorage.getItem("$#$theme");
      if (savedTheme) {
        setTheme(savedTheme);
        const html = document.documentElement;
        if (
          savedTheme === "dark" ||
          ((savedTheme === "dark" || savedTheme === "system") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      } else {
        const html = document.documentElement;
        if (
          (theme === "dark" || theme === "system") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }
    }
  }, [theme]);

  const toggleTheme = useCallback(
    (mode: string) => {
      if (typeof window !== "undefined") {
        setTheme(mode);
        localStorage.setItem("$#$theme", mode);
      }
    },
    [theme]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6">
          <path
            fillRule="evenodd"
            d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
            clipRule="evenodd"
          />
        </svg>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === "light" ? true : false}
          onCheckedChange={() => toggleTheme("light")}>
          Light
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "dark" ? true : false}
          onCheckedChange={() => toggleTheme("dark")}>
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "system" ? true : false}
          onCheckedChange={() => toggleTheme("system")}>
          System
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ToggleTheme;
