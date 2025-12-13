// app/lineups/select-system.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { useApp } from '../../contexts/AppContext';
import { useThemeColor } from '../../hooks/use-theme-color';
import { showAlert } from '../../utils/alert';
import { COLOR_THEMES, SYSTEMS } from '../../utils/constants';

export default function SelectSystemScreen() {
  const router = useRouter();
  const { selectedMatch, lineupData, setLineupData, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const [selectedSystem, setSelectedSystem] = useState<any>(null);

  const playerCount = selectedMatch?.playerCount || 11;
  const availableSystems = SYSTEMS[playerCount] || [];

  useEffect(() => {
    if (lineupData?.system) {
      const system = availableSystems.find(s => s.name === lineupData.system);
      setSelectedSystem(system || null);
    }
  }, [lineupData, availableSystems]);

  const handleNext = () => {
    if (!selectedSystem) {
      showAlert('システムを選択してください');
      return;
    }

    const requiredPlayers = selectedSystem.positions.length;
    if (lineupData.selectedPlayerIds.length < requiredPlayers) {
      showAlert(`このシステムには${requiredPlayers}名必要です。\n参加選手が${lineupData.selectedPlayerIds.length}名しか選択されていません。`);
      return;
    }

    setLineupData({
      ...lineupData,
      system: selectedSystem.name,
      systemPositions: selectedSystem.positions
    });
    router.push('/lineups/positions');
  };

  const SystemCard = ({ system }: { system: any }) => {
    const isSelected = selectedSystem?.name === system.name;

    return (
      <TouchableOpacity
        style={{
          backgroundColor: isSelected ? currentTheme.primary : '#fff',
          borderRadius: 12,
          padding: 20,
          marginBottom: 12,
          borderWidth: 2,
          borderColor: isSelected ? currentTheme.primary : '#e5e7eb',
        }}
        onPress={() => setSelectedSystem(system)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#1f2937', marginBottom: 8 }}>
              {system.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: '#6b7280' }}>
              必要人数: {system.positions.length}名
            </ThemedText>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={32} color="#8b5cf6" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ThemedView style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: currentTheme.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>システム選択</ThemedText>
          <View style={{ width: 24 }} />
        </View>
      </ThemedView>

      <ThemedView style={{ padding: 16, backgroundColor: '#f3f4f6' }}>
        <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
          {selectedMatch?.title}
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          参加選手: {lineupData?.selectedPlayerIds?.length || 0}名
        </ThemedText>
      </ThemedView>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {availableSystems.length === 0 ? (
          <ThemedView style={{ alignItems: 'center', justifyContent: 'center', padding: 64 }}>
            <ThemedText style={{ fontSize: 16, color: '#6b7280' }}>利用可能なシステムがありません</ThemedText>
          </ThemedView>
        ) : (
          availableSystems.map((system, index) => (
            <SystemCard key={index} system={system} />
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