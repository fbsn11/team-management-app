// app/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../contexts/AppContext';
import { COLOR_THEMES } from '../utils/constants';

export default function SettingsScreen() {
  const router = useRouter();
  const { colorTheme, setColorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: currentTheme.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>設定</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: 16
          }}>
            カラーテーマ
          </Text>

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
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#1f2937'
                  }}>
                    {theme.name}
                  </Text>
                </View>
                {colorTheme === theme.id && (
                  <Ionicons name="checkmark-circle" size={28} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={{
            marginTop: 24,
            padding: 16,
            backgroundColor: '#eff6ff',
            borderRadius: 8
          }}>
            <Text style={{ fontSize: 14, color: '#1e40af' }}>
              💡 メインカラーは1stユニフォームの色を選択してください
            </Text>
            <Text style={{ fontSize: 14, color: '#1e40af', marginTop: 8 }}>
              💡 セカンダリカラーは2ndユニフォームの色を選択してください
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}