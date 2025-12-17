// app/lineups/select-players.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { COLOR_THEMES } from '../../utils/constants';

export default function SelectPlayersScreen() {
  const router = useRouter();
  const { data, selectedTeam, selectedMatch, lineupData, setLineupData, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

  useEffect(() => {
    if (selectedMatch?.selectedPlayerIds) {
      setSelectedPlayerIds(selectedMatch.selectedPlayerIds);
    }
  }, [selectedMatch]);

  const teamPlayers = data.players.filter(p => p.teamId === selectedTeam?.id && selectedMatch?.selectedPlayerIds.includes(p.id));

  const handleNext = () => {
    setLineupData({
      ...lineupData,
      selectedPlayerIds,
      matchId: selectedMatch!.id,
      teamId: selectedTeam!.id
    });
    router.push('/lineups/select-system');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: currentTheme.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>参加選手確認</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={{ padding: 16, backgroundColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
          {selectedMatch?.title}
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          {selectedMatch?.datetime}
        </Text>
        <Text style={{ fontSize: 14, color: currentTheme.primary, marginTop: 8, fontWeight: 'bold' }}>
          参加選手: {selectedPlayerIds.length}名
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {teamPlayers.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 64 }}>
            <Ionicons name="person-outline" size={64} color="#d1d5db" />
            <Text style={{ fontSize: 16, color: '#6b7280', marginTop: 16 }}>参加選手が選択されていません</Text>
          </View>
        ) : (
          teamPlayers.map(player => (
            <View
              key={player.id}
              style={[
                { padding: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', backgroundColor: 'transparent' },
                selectedPlayerIds.includes(player.id) && { backgroundColor: '#ede9fe' }
              ]}
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
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>{player.name}</Text>
                  {player.memo ? (
                    <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>{player.memo}</Text>
                  ) : null}
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={{ padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
        <TouchableOpacity
          style={{ paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, backgroundColor: currentTheme.primary, alignItems: 'center' }}
          onPress={handleNext}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>次へ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}