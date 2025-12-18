// app/lineups/positions.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { showAlert } from '../../utils/alert';
import { COLOR_THEMES } from '../../utils/constants';

export default function PositionsScreen() {
  const router = useRouter();
  const { data, setData, selectedMatch, lineupData, setLineupData, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];

  const [positions, setPositions] = useState<any[]>([]);
  const [unassignedPlayers, setUnassignedPlayers] = useState<any[]>([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const isEditMode = !!lineupData.id; // 編集モード判定

  useEffect(() => {
    // 初期化
    const systemPositions = lineupData.systemPositions || [];

    if (isEditMode && lineupData.existingPositions) {
      // 編集モード: 既存のポジション配置を復元
      setPositions(lineupData.existingPositions);

      // ベンチ選手を計算
      const assignedPlayerIds = lineupData.existingPositions
        .filter((pos: any) => pos.playerId)
        .map((pos: any) => pos.playerId);

      const unassigned = lineupData.selectedPlayerIds
        .filter((id: number) => !assignedPlayerIds.includes(id))
        .map((id: number) => {
          const player = data.players.find(p => p.id === id);
          return { id, name: player?.name || '' };
        });

      setUnassignedPlayers(unassigned);
    } else {
      // 新規作成モード
      const initialPositions = systemPositions.map((pos: string) => ({
        position: pos,
        playerId: null,
        playerName: null
      }));
      setPositions(initialPositions);

      const players = lineupData.selectedPlayerIds.map((id: number) => {
        const player = data.players.find(p => p.id === id);
        return { id, name: player?.name || '' };
      });
      setUnassignedPlayers(players);
    }
  }, [lineupData, data.players]);

  const assignPlayer = (positionIndex: number) => {
    if (!selectedPlayerId) {
      showAlert('選手を選択してください');
      return;
    }

    const player = unassignedPlayers.find(p => p.id === selectedPlayerId);
    if (!player) return;

    // ポジションに配置
    const newPositions = [...positions];
    newPositions[positionIndex] = {
      ...newPositions[positionIndex],
      playerId: player.id,
      playerName: player.name
    };
    setPositions(newPositions);

    // ベンチから削除
    setUnassignedPlayers(prev => prev.filter(p => p.id !== selectedPlayerId));
    setSelectedPlayerId(null);
  };

  const removePlayer = (positionIndex: number) => {
    const position = positions[positionIndex];
    if (!position.playerId) return;

    // ベンチに戻す
    setUnassignedPlayers(prev => [...prev, { id: position.playerId, name: position.playerName }]);

    // ポジションから削除
    const newPositions = [...positions];
    newPositions[positionIndex] = {
      ...newPositions[positionIndex],
      playerId: null,
      playerName: null
    };
    setPositions(newPositions);
  };

  const handleComplete = () => {
    // 全ポジション配置済みチェック
    const allAssigned = positions.every((pos: any) => pos.playerId !== null);
    if (!allAssigned) {
      showAlert('全てのポジションに選手を配置してください');
      return;
    }

    if (isEditMode) {
      // 編集モード: 既存のlineupを更新
      setData((prev: any) => ({
        ...prev,
        lineups: prev.lineups.map((lineup: any) =>
          lineup.id === lineupData.id
            ? {
                ...lineup,
                selectedPlayerIds: lineupData.selectedPlayerIds,
                system: lineupData.system,
                positions: positions,
                updatedAt: new Date().toISOString()
              }
            : lineup
        )
      }));
      showAlert('メンバー選出を更新しました');
    } else {
      // 新規作成モード
      const newLineup = {
        id: Date.now(),
        matchId: selectedMatch!.id,
        teamId: lineupData.teamId,
        selectedPlayerIds: lineupData.selectedPlayerIds,
        system: lineupData.system,
        positions: positions,
        createdAt: new Date().toISOString()
      };

      setData((prev: any) => ({
        ...prev,
        lineups: [...(prev.lineups || []), newLineup]
      }));
      showAlert('メンバー選出を保存しました');
    }

    router.replace('/lineups');
  };

  // ポジション別にグループ化
  const groupedPositions = positions.reduce((acc: any, pos: any, index: number) => {
    const posType = pos.position.replace(/[0-9]/g, '');
    if (!acc[posType]) acc[posType] = [];
    acc[posType].push({ ...pos, index });
    return acc;
  }, {});

  const positionOrder = ['FW', 'MF', 'DF', 'GK', 'FP'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ paddingVertical: 12, paddingHorizontal: 16, backgroundColor: currentTheme.primary }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>
            {isEditMode ? 'ポジション編集' : 'ポジション配置'}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      <View style={{ padding: 16, backgroundColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
          {selectedMatch?.title}
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          システム: {lineupData?.system}
        </Text>
        {isEditMode && (
          <Text style={{ fontSize: 12, color: currentTheme.primary, marginTop: 4, fontWeight: 'bold' }}>
            編集モード
          </Text>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* フィールド */}
        <View style={{ padding: 16, backgroundColor: '#16a34a20' }}>
          <View style={{
            backgroundColor: '#16a34a',
            borderRadius: 12,
            padding: 20,
            minHeight: 400
          }}>
            {positionOrder.map(posType => {
              const posGroup = groupedPositions[posType];
              if (!posGroup) return null;

              return (
                <View key={posType} style={{ marginBottom: 20 }}>
                  <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: 8
                  }}>
                    {posGroup.map((pos: any) => (
                      <TouchableOpacity
                        key={pos.index}
                        style={{
                          backgroundColor: pos.playerId ? currentTheme.primary : '#fff',
                          borderRadius: 25,
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          minWidth: 100,
                          alignItems: 'center',
                          borderWidth: 2,
                          borderColor: pos.playerId ? currentTheme.primary : '#d1d5db'
                        }}
                        onPress={() => {
                          if (pos.playerId) {
                            removePlayer(pos.index);
                          } else {
                            assignPlayer(pos.index);
                          }
                        }}
                      >
                        <Text style={{
                          fontSize: 10,
                          color: pos.playerId ? '#fff' : '#6b7280',
                          fontWeight: 'bold'
                        }}>
                          {pos.position}
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: pos.playerId ? '#fff' : '#9ca3af',
                          fontWeight: 'bold',
                          marginTop: 2
                        }}>
                          {pos.playerName || '未配置'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ベンチ */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 }}>
            ベンチ ({unassignedPlayers.length}名)
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {unassignedPlayers.map(player => (
              <TouchableOpacity
                key={player.id}
                style={{
                  backgroundColor: selectedPlayerId === player.id ? currentTheme.primary : '#fff',
                  borderRadius: 8,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderWidth: 2,
                  borderColor: selectedPlayerId === player.id ? currentTheme.primary : '#e5e7eb'
                }}
                onPress={() => setSelectedPlayerId(player.id)}
              >
                <Text style={{
                  fontSize: 14,
                  color: selectedPlayerId === player.id ? '#fff' : '#1f2937',
                  fontWeight: 'bold'
                }}>
                  {player.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={{ padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
        <TouchableOpacity
          style={{ paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, backgroundColor: currentTheme.primary, alignItems: 'center' }}
          onPress={handleComplete}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fff' }}>
            {isEditMode ? '更新' : '完了'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}