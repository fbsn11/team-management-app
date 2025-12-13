// app/matches/edit.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showAlert } from '../../utils/alert';
import { COLOR_THEMES, PLAYER_COUNTS } from '../../utils/constants';

export default function MatchEditScreen() {
  const router = useRouter();
  const { data, setData, selectedTeam, editingItem, setEditingItem, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];
  
  const [matchForm, setMatchForm] = useState({ 
    datetime: '', 
    title: '', 
    memo: '',
    playerCount: selectedTeam?.defaultPlayerCount || 11
  });

  useEffect(() => {
    if (editingItem) {
      setMatchForm({
        datetime: editingItem.datetime,
        title: editingItem.title,
        memo: editingItem.memo,
        playerCount: editingItem.playerCount || selectedTeam?.defaultPlayerCount || 11
      });
    } else {
      setMatchForm({
        datetime: '',
        title: '',
        memo: '',
        playerCount: selectedTeam?.defaultPlayerCount || 11
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

    setMatchForm({ datetime: '', title: '', memo: '', playerCount: selectedTeam?.defaultPlayerCount || 11 });
    setEditingItem(null);
    router.back();
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.secondary }]}>
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

          <Text style={commonStyles.formLabel}>人数制</Text>
          <View style={commonStyles.pickerContainer}>
            {PLAYER_COUNTS.map(pc => (
              <TouchableOpacity
                key={pc.value}
                style={[
                  commonStyles.pickerItem,
                  matchForm.playerCount === pc.value && commonStyles.pickerItemSelected
                ]}
                onPress={() => setMatchForm({ ...matchForm, playerCount: pc.value })}
              >
                <Text style={[
                  commonStyles.pickerText,
                  matchForm.playerCount === pc.value && commonStyles.pickerTextSelected
                ]}>
                  {pc.label}
                </Text>
              </TouchableOpacity>
            ))}
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
            style={[commonStyles.submitButton, { backgroundColor: currentTheme.secondary }]}
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
