import { useTheme } from "../../hooks/Themecontext";
import { Sun, Moon } from "lucide-react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <button
      onClick={() => setTheme(darkMode ? "light" : "dark")}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-800 transition-all border-1"
    >
      {darkMode ? (
        <Sun className="w-4 h-4 text-white" />
      ) : (
        <Moon className="w-4 h-4 text-gray-700" />
      )}
    </button>
  );
}
