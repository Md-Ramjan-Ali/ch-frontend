import { useTheme } from "@/hooks/useTheme";

 
 
const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 mt-4 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:opacity-80 transition-colors duration-300"
    >
      {theme === "light" ? "Switch to Dark" : "Switch to Light"}
    </button>
  );
};

export default ThemeButton;