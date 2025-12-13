// app/teams/[id].tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { COLOR_THEMES } from '../../utils/constants';

export default function TeamDetailScreen() {
  const router = useRouter();
  const { data, selectedTeam, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
        <View style={commonStyles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>{selectedTeam?.name}</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
          onPress={() => router.push('/matches')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="calendar" size={28} color={currentTheme.secondary} />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>試合管理</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                {data.matches.filter(m => m.teamId === selectedTeam?.id).length}件
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 2,
          }}
          onPress={() => router.push('/players')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="person" size={28} color={currentTheme.primary} />
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>選手管理</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                {data.players.filter(p => p.teamId === selectedTeam?.id).length}名
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
