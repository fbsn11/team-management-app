// app/matches/edit.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showAlert } from '../../utils/alert';
import { COLOR_THEMES } from '../../utils/constants';

export default function MatchEditScreen() {
  const router = useRouter();
  const { data, setData, selectedTeam, editingItem, setEditingItem, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];
  
  const teamPlayers = data.players.filter(p => p.teamId === selectedTeam?.id);
  
  const [matchForm, setMatchForm] = useState({ 
    datetime: '', 
    title: '', 
    memo: '',
    playerCount: selectedTeam?.defaultPlayerCount || 11,
    selectedPlayerIds: [] as number[]
  });

  useEffect(() => {
    if (editingItem) {
      setMatchForm({
        datetime: editingItem.datetime,
        title: editingItem.title,
        memo: editingItem.memo,
        playerCount: editingItem.playerCount || selectedTeam?.defaultPlayerCount || 11,
        selectedPlayerIds: editingItem.selectedPlayerIds || []
      });
    } else {
      setMatchForm({
        datetime: '',
        title: '',
        memo: '',
        playerCount: selectedTeam?.defaultPlayerCount || 11,
        selectedPlayerIds: []
      });
    }
  }, [editingItem, selectedTeam]);

  const saveMatch = () => {
    if (!matchForm.datetime || !matchForm.title.trim()) {
      showAlert('日時とタイトルを入力してください');
      return;
    }

    if (editingItem) {
      setData(prev => ({
        ...prev,
        matches: prev.matches.map(m => 
          m.id === editingItem.id ? { ...m, ...matchForm } : m
        )
      }));
    } else {
      const newMatch = {
        id: Date.now(),
        teamId: selectedTeam!.id,
        ...matchForm
      };
      setData(prev => ({ ...prev, matches: [...prev.matches, newMatch] }));
    }

    setMatchForm({ datetime: '', title: '', memo: '', playerCount: selectedTeam?.defaultPlayerCount || 11, selectedPlayerIds: [] });
    setEditingItem(null);
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
        <View style={commonStyles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>
            {editingItem ? '試合編集' : '試合登録'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={commonStyles.formContainer}>
        <View style={commonStyles.formCard}>
          <Text style={commonStyles.formLabel}>
            日時 <Text style={commonStyles.required}>*</Text>
          </Text>
          <TextInput
            style={commonStyles.input}
            value={matchForm.datetime}
            onChangeText={(text) => setMatchForm({ ...matchForm, datetime: text })}
            placeholder="例: 2024/12/25 14:00"
            placeholderTextColor="#9ca3af"
          />

          <Text style={commonStyles.formLabel}>
            タイトル <Text style={commonStyles.required}>*</Text>
          </Text>
          <TextInput
            style={commonStyles.input}
            value={matchForm.title}
            onChangeText={(text) => setMatchForm({ ...matchForm, title: text })}
            placeholder="例: 練習試合 vs 横浜FC"
            placeholderTextColor="#9ca3af"
          />

          <Text style={commonStyles.formLabel}>参加選手選択</Text>
          <View style={{ marginBottom: 16 }}>
            {teamPlayers.length === 0 ? (
              <Text style={{ color: '#6b7280', fontSize: 14 }}>選手が登録されていません</Text>
            ) : (
              teamPlayers.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 8,
                    backgroundColor: matchForm.selectedPlayerIds.includes(player.id) ? '#ede9fe' : '#f9fafb',
                    marginBottom: 8
                  }}
                  onPress={() => {
                    setMatchForm(prev => ({
                      ...prev,
                      selectedPlayerIds: prev.selectedPlayerIds.includes(player.id)
                        ? prev.selectedPlayerIds.filter(id => id !== player.id)
                        : [...prev.selectedPlayerIds, player.id]
                    }));
                  }}
                >
                  <View style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: matchForm.selectedPlayerIds.includes(player.id) ? currentTheme.primary : '#d1d5db',
                    backgroundColor: matchForm.selectedPlayerIds.includes(player.id) ? currentTheme.primary : '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12
                  }}>
                    {matchForm.selectedPlayerIds.includes(player.id) && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={{ fontSize: 16, color: '#1f2937' }}>{player.name}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>

          <Text style={commonStyles.formLabel}>メモ</Text>
          <TextInput
            style={[commonStyles.input, commonStyles.textArea]}
            value={matchForm.memo}
            onChangeText={(text) => setMatchForm({ ...matchForm, memo: text })}
            placeholder="場所や持ち物など"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[commonStyles.submitButton, { backgroundColor: currentTheme.primary }]}
            onPress={saveMatch}
          >
            <Text style={commonStyles.submitButtonText}>
              {editingItem ? '更新' : '登録'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
