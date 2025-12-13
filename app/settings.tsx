// app/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { useApp } from '../contexts/AppContext';
import { useThemeColor } from '../hooks/use-theme-color';
import { COLOR_THEMES } from '../utils/constants';

export default function SettingsScreen() {
  const router = useRouter();
  const { colorTheme, setColorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <ThemedView style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: currentTheme.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>設定</ThemedText>
          <View style={{ width: 24 }} />
        </View>
      </ThemedView>

      <ScrollView style={{ flex: 1 }}>
        <ThemedView style={{ padding: 16 }}>
          <ThemedText style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: 16
          }}>
            カラーテーマ
          </ThemedText>

          <View style={{ gap: 12 }}>
            {COLOR_THEMES.map(theme => (
              <TouchableOpacity
                key={theme.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: colorTheme === theme.id ? theme.primary : '#e5e7eb',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2
                }}
                onPress={() => setColorTheme(theme.id)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                  <View style={{ flexDirection: 'row', gap: 8, marginRight: 16 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: theme.primary
                    }} />
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: theme.secondary
                    }} />
                  </View>
                  <ThemedText style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>
                    {theme.name}
                  </ThemedText>
                </View>
                {colorTheme === theme.id && (
                  <Ionicons name="checkmark-circle" size={28} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <ThemedView style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#eff6ff',
            borderRadius: 8
          }}>
            <ThemedText style={{ fontSize: 14, color: '#1e40af' }}>
              💡 メインカラーは1stユニフォームの色を選択してください
            </ThemedText>
            <ThemedText style={{ fontSize: 14, color: '#1e40af', marginTop: 8 }}>
              💡 セカンダリカラーは2ndユニフォームの色を選択してください
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}