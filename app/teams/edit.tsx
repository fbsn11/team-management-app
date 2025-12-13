// app/teams/edit.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showAlert } from '../../utils/alert';
import { COLOR_THEMES, PLAYER_COUNTS } from '../../utils/constants';

export default function TeamEditScreen() {
  const router = useRouter();
  const { data, setData, editingItem, setEditingItem, setSelectedTeam, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];
  
  const [teamForm, setTeamForm] = useState({ name: '', defaultPlayerCount: 11 });

  useEffect(() => {
    if (editingItem) {
      setTeamForm({ 
        name: editingItem.name,
        defaultPlayerCount: editingItem.defaultPlayerCount || 11
      });
    }
  }, [editingItem]);

  const saveTeam = () => {
    if (!teamForm.name.trim()) {
      showAlert('チーム名を入力してください');
      return;
    }

    if (editingItem) {
      setData(prev => ({
        ...prev,
        teams: prev.teams.map(t => 
          t.id === editingItem.id ? { ...t, ...teamForm } : t
        )
      }));
      setTeamForm({ name: '', defaultPlayerCount: 11 });
      setEditingItem(null);
      router.back();
    } else {
      const newTeam = { id: Date.now(), ...teamForm };
      setData(prev => ({ ...prev, teams: [...prev.teams, newTeam] }));
      setSelectedTeam(newTeam);
      setTeamForm({ name: '', defaultPlayerCount: 11 });
      setEditingItem(null);
      router.replace(`/teams/${newTeam.id}`);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
        <View style={commonStyles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>
            {editingItem ? 'チーム編集' : 'チーム登録'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={commonStyles.formContainer}>
        <View style={commonStyles.formCard}>
          <Text style={commonStyles.formLabel}>
            チーム名 <Text style={commonStyles.required}>*</Text>
          </Text>
          <TextInput
            style={commonStyles.input}
            value={teamForm.name}
            onChangeText={(text) => setTeamForm({ ...teamForm, name: text })}
            placeholder="例: FC東京"
            placeholderTextColor="#9ca3af"
          />

          <Text style={commonStyles.formLabel}>デフォルト人数制</Text>
          <View style={commonStyles.radioGroup}>
            {PLAYER_COUNTS.map(pc => (
              <TouchableOpacity
                key={pc.value}
                style={commonStyles.radioButton}
                onPress={() => setTeamForm({ ...teamForm, defaultPlayerCount: pc.value })}
              >
                <View style={[
                  commonStyles.radio,
                  teamForm.defaultPlayerCount === pc.value && commonStyles.radioSelected
                ]} />
                <Text style={commonStyles.radioLabel}>{pc.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={commonStyles.submitButton} onPress={saveTeam}>
            <Text style={commonStyles.submitButtonText}>
              {editingItem ? '更新' : '登録'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
