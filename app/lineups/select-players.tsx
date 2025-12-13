// app/lineups/select-players.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useApp } from '../../contexts/AppContext';
import { useThemeColor } from '../../hooks/use-theme-color';
import { showAlert } from '../../utils/alert';
import { COLOR_THEMES } from '../../utils/constants';

export default function SelectPlayersScreen() {
  const router = useRouter();
  const { data, selectedTeam, selectedMatch, lineupData, setLineupData, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  useEffect(() => {
    if (lineupData?.selectedPlayerIds) {
      setSelectedPlayerIds(lineupData.selectedPlayerIds);
    }
  }, [lineupData]);

  const teamPlayers = data.players.filter(p => p.teamId === selectedTeam?.id);

  const togglePlayer = (playerId: number) => {
    setSelectedPlayerIds(prev => {
      if (prev.includes(playerId)) {
        return prev.filter(id => id !== playerId);
      } else {
        return [...prev, playerId];
      }
    });
  };

  const handleNext = () => {
    if (selectedPlayerIds.length === 0) {
      showAlert('参加選手を選択してください');
      return;
    }

    setLineupData({
      ...lineupData,
      selectedPlayerIds,
      matchId: selectedMatch!.id,
      teamId: selectedTeam!.id
    });
    router.push('/lineups/select-system');
  };

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ThemedView style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: currentTheme.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>参加選手選択</ThemedText>
          <View style={{ width: 24 }} />
        </View>
      </ThemedView>

      <ThemedView style={{ padding: 16, backgroundColor: '#f3f4f6' }}>
        <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
          {selectedMatch?.title}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          {selectedMatch?.datetime}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: currentTheme.primary, marginTop: 8, fontWeight: 'bold' }}>
          選択中: {selectedPlayerIds.length}名
        </ThemedText>
      </ThemedView>

      <ScrollView style={{ flex: 1 }}>
        {teamPlayers.length === 0 ? (
          <ThemedView style={{ alignItems: 'center', justifyContent: 'center', padding: 64 }}>
            <Ionicons name="person-outline" size={64} color="#d1d5db" />
            <ThemedText style={{ fontSize: 16, color: '#6b7280', marginTop: 16 }}>選手が登録されていません</ThemedText>
          </ThemedView>
        ) : (
          teamPlayers.map(player => (
            <TouchableOpacity
              key={player.id}
              style={[
                { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: 'transparent' },
                selectedPlayerIds.includes(player.id) && { backgroundColor: '#ede9fe' }
              ]}
              onPress={() => togglePlayer(player.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: selectedPlayerIds.includes(player.id) ? currentTheme.primary : '#d1d5db',
                  backgroundColor: selectedPlayerIds.includes(player.id) ? currentTheme.primary : '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12
                }}>
                  {selectedPlayerIds.includes(player.id) && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={{ fontSize: 16, fontWeight: '500' }}>{player.name}</ThemedText>
                  {player.memo ? (
                    <ThemedText style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{player.memo}</ThemedText>
                  ) : null}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <ThemedView style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
        <TouchableOpacity
          style={{ paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, backgroundColor: currentTheme.primary, alignItems: 'center' }}
          onPress={handleNext}
        >
          <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>次へ</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </SafeAreaView>
  );
}