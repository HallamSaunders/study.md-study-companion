// app/ThemeContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import Colors from '../constants/Colors'; // Adjust path as necessary

interface ThemeColors {
    text: string,
    subtleText: string,
    background: string,
    border: string,
    tint: string,
    tabIconDefault: string,
    tabIconSelected: string,
}

interface ThemeContextType {
  themeColors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();
  const themeColors: ThemeColors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
