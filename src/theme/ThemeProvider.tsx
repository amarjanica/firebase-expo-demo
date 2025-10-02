import React from 'react';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SystemBars } from 'react-native-edge-to-edge';

const ModeContext = React.createContext({
  mode: 'light' as 'light' | 'dark',
  toggleMode: () => {},
});
const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');

  return (
    <ModeContext.Provider
      value={{
        mode,
        toggleMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
      }}>
      <SystemBars style={mode} />
      <PaperProvider theme={mode === 'light' ? MD3DarkTheme : MD3DarkTheme}>{children}</PaperProvider>
    </ModeContext.Provider>
  );
};

export const useModeContext = () => React.useContext(ModeContext);

export default ThemeProvider;
