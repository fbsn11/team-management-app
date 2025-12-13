// contexts/AppContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DEFAULT_COLOR_THEME } from '../utils/constants';

const STORAGE_KEY = '@soccer_team_data';
const THEME_STORAGE_KEY = '@app_color_theme';

interface Team {
  id: number;
  name: string;
  defaultPlayerCount: number;
}

interface Match {
  id: number;
  teamId: number;
  datetime: string;
  title: string;
  memo: string;
  playerCount: number;
}

interface Player {
  id: number;
  teamId: number;
  name: string;
  memo: string;
}

interface Lineup {
  id: number;
  matchId: number;
  teamId: number;
  selectedPlayerIds: number[];
  system: string;
  positions: {
    position: string;
    playerId: number;
    playerName: string;
  }[];
  createdAt: string;
}

interface AppData {
  teams: Team[];
  matches: Match[];
  players: Player[];
  lineups: Lineup[];
}

interface AppContextType {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  colorTheme: string;
  setColorTheme: React.Dispatch<React.SetStateAction<string>>;
  selectedTeam: Team | null;
  setSelectedTeam: React.Dispatch<React.SetStateAction<Team | null>>;
  selectedMatch: Match | null;
  setSelectedMatch: React.Dispatch<React.SetStateAction<Match | null>>;
  editingItem: any;
  setEditingItem: React.Dispatch<React.SetStateAction<any>>;
  lineupData: any;
  setLineupData: React.Dispatch<React.SetStateAction<any>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>({
    teams: [],
    matches: [],
    players: [],
    lineups: []
  });

  const [colorTheme, setColorTheme] = useState(DEFAULT_COLOR_THEME);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [lineupData, setLineupData] = useState<any>({});

  useEffect(() => {
    loadData();
    loadTheme();
  }, []);

  useEffect(() => {
    if (data.teams.length > 0 || data.matches.length > 0 || data.players.length > 0) {
      saveData();
    }
  }, [data]);

  useEffect(() => {
    saveTheme();
  }, [colorTheme]);

  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setData(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error('データの読み込みに失敗しました', e);
    }
  };

  const saveData = async () => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('データの保存に失敗しました', e);
    }
  };

  const loadTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (theme != null) {
        setColorTheme(theme);
      }
    } catch (e) {
      console.error('テーマの読み込みに失敗しました', e);
    }
  };

  const saveTheme = async () => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, colorTheme);
    } catch (e) {
      console.error('テーマの保存に失敗しました', e);
    }
  };

  return (
    <AppContext.Provider
      value={{
        data,
        setData,
        colorTheme,
        setColorTheme,
        selectedTeam,
        setSelectedTeam,
        selectedMatch,
        setSelectedMatch,
        editingItem,
        setEditingItem,
        lineupData,
        setLineupData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
