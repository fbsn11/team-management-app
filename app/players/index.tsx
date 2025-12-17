// app/players/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showConfirm } from '../../utils/alert';
import { COLOR_THEMES } from '../../utils/constants';

export default function PlayerListScreen() {
  const router = useRouter();
  const { data, setData, selectedTeam, setEditingItem, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  if (!selectedTeam) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
          <View style={commonStyles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={commonStyles.headerTitle}>選手一覧</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginTop: 16 }}>チームが選択されていません</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
            チームを選択してから選手を管理してください。
          </Text>
          <TouchableOpacity
            style={[commonStyles.submitButton, { backgroundColor: currentTheme.primary, marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={commonStyles.submitButtonText}>戻る</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const deletePlayer = (id: number) => {
    showConfirm('この選手を削除しますか?', () => {
      setData(prev => ({
        ...prev,
        players: prev.players.filter(p => p.id !== id)
      }));
    });
  };

  const teamPlayers = data.players.filter(p => p.teamId === selectedTeam?.id);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
        <View style={commonStyles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>選手一覧</Text>
          <TouchableOpacity
            onPress={() => {
              setEditingItem(null);
              router.push('/players/edit');
            }}
          >
            <Ionicons name="add-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.listContainer}>
        {teamPlayers.length === 0 ? (
          <View style={commonStyles.emptyState}>
            <Ionicons name="person-outline" size={64} color="#d1d5db" />
            <Text style={commonStyles.emptyText}>選手が登録されていません</Text>
          </View>
        ) : (
          teamPlayers.map(player => (
            <View key={player.id} style={commonStyles.listItem}>
              <View style={commonStyles.listItemContent}>
                <Text style={commonStyles.listItemTitle}>{player.name}</Text>
                {player.memo ? (
                  <Text style={commonStyles.listItemMemo}>{player.memo}</Text>
                ) : null}
              </View>
              <View style={commonStyles.listItemActions}>
                <TouchableOpacity
                  style={commonStyles.iconButton}
                  onPress={() => {
                    setEditingItem(player);
                    router.push('/players/edit');
                  }}
                >
                  <Ionicons name="create-outline" size={22} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={commonStyles.iconButton}
                  onPress={() => deletePlayer(player.id)}
                >
                  <Ionicons name="trash-outline" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
