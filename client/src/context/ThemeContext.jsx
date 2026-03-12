// ThemeContext — poore app mein dark/light mode share karta hai
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

// Custom hook — kisi bhi component mein theme access karne ke liye
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Dark mode state — default false (light mode)
  const [darkMode, setDarkMode] = useState(false);

  // Toggle function
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};