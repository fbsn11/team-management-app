// app/teams/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showConfirm } from '../../utils/alert';
import { COLOR_THEMES, PLAYER_COUNTS } from '../../utils/constants';

export default function TeamListScreen() {
  const router = useRouter();
  const { data, setData, colorTheme, setSelectedTeam, setEditingItem } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const deleteTeam = (id: number) => {
    showConfirm('このチームを削除しますか?\n関連する試合と選手も削除されます。', () => {
      setData(prev => ({
        teams: prev.teams.filter(t => t.id !== id),
        matches: prev.matches.filter(m => m.teamId !== id),
        players: prev.players.filter(p => p.teamId !== id),
        lineups: prev.lineups.filter(l => l.teamId !== id)
      }));
    });
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
        <View style={commonStyles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>チーム一覧</Text>
          <TouchableOpacity
            onPress={() => {
              setEditingItem(null);
              router.push('/teams/edit');
            }}
          >
            <Ionicons name="add-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.listContainer}>
        {data.teams.length === 0 ? (
          <View style={commonStyles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text style={commonStyles.emptyText}>チームが登録されていません</Text>
          </View>
        ) : (
          data.teams.map(team => (
            <View key={team.id} style={commonStyles.listItem}>
              <TouchableOpacity
                style={commonStyles.listItemContent}
                onPress={() => {
                  setSelectedTeam(team);
                  router.push(`/teams/${team.id}`);
                }}
              >
                <Text style={commonStyles.listItemTitle}>{team.name}</Text>
                <Text style={commonStyles.listItemSubtitle}>
                  {PLAYER_COUNTS.find(pc => pc.value === team.defaultPlayerCount)?.label || '11人制'} / 
                  試合: {data.matches.filter(m => m.teamId === team.id).length}件 / 
                  選手: {data.players.filter(p => p.teamId === team.id).length}名
                </Text>
              </TouchableOpacity>
              <View style={commonStyles.listItemActions}>
                <TouchableOpacity
                  style={commonStyles.iconButton}
                  onPress={() => {
                    setEditingItem(team);
                    router.push('/teams/edit');
                  }}
                >
                  <Ionicons name="create-outline" size={22} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={commonStyles.iconButton}
                  onPress={() => deleteTeam(team.id)}
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
