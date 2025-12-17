// app/matches/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showConfirm } from '../../utils/alert';
import { COLOR_THEMES, PLAYER_COUNTS } from '../../utils/constants';

export default function MatchListScreen() {
  const router = useRouter();
  const { data, setData, selectedTeam, setEditingItem, setSelectedMatch, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const deleteMatch = (id: number) => {
    showConfirm('この試合を削除しますか?', () => {
      setData(prev => ({
        ...prev,
        matches: prev.matches.filter(m => m.id !== id),
        lineups: prev.lineups.filter(l => l.matchId !== id)
      }));
    });
  };

  const startLineup = (match: any) => {
    setSelectedMatch(match);
    const hasLineup = data.lineups?.some(l => l.matchId === match.id);
    
    if (hasLineup) {
      router.push('/lineups');
    } else {
      router.push('/lineups/select-players');
    }
  };

  const hasLineup = (matchId: number) => {
    return data.lineups?.some(l => l.matchId === matchId);
  };

  const teamMatches = data.matches
    .filter(m => m.teamId === selectedTeam?.id)
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
        <View style={commonStyles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>試合一覧</Text>
          <TouchableOpacity
            onPress={() => {
              setEditingItem(null);
              router.push('/matches/edit');
            }}
          >
            <Ionicons name="add-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={commonStyles.listContainer}>
        {teamMatches.length === 0 ? (
          <View style={commonStyles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#d1d5db" />
            <Text style={commonStyles.emptyText}>試合が登録されていません</Text>
          </View>
        ) : (
          teamMatches.map(match => (
            <View key={match.id} style={commonStyles.listItem}>
              <View style={{ flex: 1 }}>
                <Text style={commonStyles.listItemTitle}>{match.title}</Text>
                <Text style={commonStyles.listItemSubtitle}>
                  {match.datetime} / {PLAYER_COUNTS.find(pc => pc.value === match.playerCount)?.label || '11人制'}
                </Text>
                {match.memo ? (
                  <Text style={commonStyles.listItemMemo}>{match.memo}</Text>
                ) : null}
                
                <TouchableOpacity
                  style={{
                    backgroundColor: hasLineup(match.id) ? '#10b981' : '#8b5cf6',
                    borderRadius: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    marginTop: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onPress={() => startLineup(match)}
                >
                  <Ionicons 
                    name={hasLineup(match.id) ? 'checkmark-circle' : 'people'} 
                    size={16} 
                    color="#fff" 
                  />
                  <Text style={{ 
                    color: '#fff', 
                    fontWeight: 'bold', 
                    marginLeft: 6,
                    fontSize: 14
                  }}>
                    {hasLineup(match.id) ? 'メンバー確認' : 'メンバー選出'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={commonStyles.listItemActions}>
                <TouchableOpacity
                  style={commonStyles.iconButton}
                  onPress={() => {
                    setEditingItem(match);
                    router.push('/matches/edit');
                  }}
                >
                  <Ionicons name="create-outline" size={22} color="#3b82f6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={commonStyles.iconButton}
                  onPress={() => deleteMatch(match.id)}
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
