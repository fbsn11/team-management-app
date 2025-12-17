// app/players/edit.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showAlert } from '../../utils/alert';
import { COLOR_THEMES } from '../../utils/constants';

export default function PlayerEditScreen() {
  const router = useRouter();
  const { data, setData, selectedTeam, editingItem, setEditingItem, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];
  
  if (!selectedTeam) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
          <View style={commonStyles.headerContent}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={commonStyles.headerTitle}>エラー</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Ionicons name="alert-circle" size={64} color="#ef4444" />
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginTop: 16 }}>チームが選択されていません</Text>
          <Text style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', marginTop: 8 }}>
            チームを選択してから選手を登録してください。
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
  
  const [playerForm, setPlayerForm] = useState({ name: '', memo: '' });

  useEffect(() => {
    if (editingItem) {
      setPlayerForm({
        name: editingItem.name,
        memo: editingItem.memo
      });
    }
  }, [editingItem]);

  const savePlayer = () => {
    if (!playerForm.name.trim()) {
      showAlert('選手名を入力してください');
      return;
    }

    if (editingItem) {
      setData(prev => ({
        ...prev,
        players: prev.players.map(p => 
          p.id === editingItem.id ? { ...p, ...playerForm } : p
        )
      }));
    } else {
      const newPlayer = {
        id: Date.now(),
        teamId: selectedTeam!.id,
        ...playerForm
      };
      setData(prev => ({ ...prev, players: [...prev.players, newPlayer] }));
    }

    setPlayerForm({ name: '', memo: '' });
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
            {editingItem ? '選手編集' : '選手登録'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={commonStyles.formContainer}>
        <View style={commonStyles.formCard}>
          <Text style={commonStyles.formLabel}>
            選手名 <Text style={commonStyles.required}>*</Text>
          </Text>
          <TextInput
            style={commonStyles.input}
            value={playerForm.name}
            onChangeText={(text) => setPlayerForm({ ...playerForm, name: text })}
            placeholder="例: 山田太郎"
            placeholderTextColor="#9ca3af"
          />

          <Text style={commonStyles.formLabel}>メモ</Text>
          <TextInput
            style={[commonStyles.input, commonStyles.textArea]}
            value={playerForm.memo}
            onChangeText={(text) => setPlayerForm({ ...playerForm, memo: text })}
            placeholder="ポジションや特記事項など"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[commonStyles.submitButton, { backgroundColor: currentTheme.primary }]}
            onPress={savePlayer}
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
