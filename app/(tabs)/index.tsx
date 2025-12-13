// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { COLOR_THEMES } from '../../utils/constants';

export default function HomeScreen() {
  const router = useRouter();
  const { data, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.homeHeader}>
          <View style={[styles.iconCircle, { backgroundColor: currentTheme.primary }]}>
            <Ionicons name="football" size={50} color="#fff" />
          </View>
          <Text style={styles.homeTitle}>サッカーチーム管理</Text>
          <Text style={styles.homeSubtitle}>試合メンバー選出アプリ</Text>
        </View>

        <TouchableOpacity
          style={styles.homeCard}
          onPress={() => router.push('/teams')}
        >
          <View style={styles.homeCardContent}>
            <Ionicons name="people" size={32} color={currentTheme.primary} />
            <View style={styles.homeCardText}>
              <Text style={styles.homeCardTitle}>チーム管理</Text>
              <Text style={styles.homeCardSubtitle}>
                {data.teams.length}チーム登録済み
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeCard}
          onPress={() => router.push('/settings')}
        >
          <View style={styles.homeCardContent}>
            <Ionicons name="settings" size={32} color={currentTheme.secondary} />
            <View style={styles.homeCardText}>
              <Text style={styles.homeCardTitle}>設定</Text>
              <Text style={styles.homeCardSubtitle}>カラーテーマなど</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
  homeHeader: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  homeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  homeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  homeCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  homeCardText: {
    marginLeft: 16,
  },
  homeCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  homeCardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});
