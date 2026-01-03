// app/lineups/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useApp } from '../../contexts/AppContext';
import { commonStyles } from '../../styles/commonStyles';
import { showConfirm } from '../../utils/alert';
import { COLOR_THEMES } from '../../utils/constants';

export default function LineupListScreen() {
  const router = useRouter();
  const { matchId } = useLocalSearchParams();
  const { data, setData, selectedMatch, setLineupData, setSelectedMatch, colorTheme } = useApp();
  const currentTheme = COLOR_THEMES.find(t => t.id === colorTheme) || COLOR_THEMES[0];
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (matchId && !selectedMatch) {
      const id = Array.isArray(matchId) ? matchId[0] : matchId;
      const match = data.matches.find(m => m.id === parseInt(id));
      if (match) {
        setSelectedMatch(match);
      }
    }
  }, [matchId, data.matches, selectedMatch, setSelectedMatch]);

  const matchLineups = data.lineups
    ?.filter(l => l.matchId === selectedMatch?.id)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) || [];

  const playerStats = useMemo(() => {
    const stats: Record<number, any> = {};
    
    matchLineups.forEach(lineup => {
      lineup.positions.forEach(pos => {
        if (!pos.playerId) return;
        
        if (!stats[pos.playerId]) {
          stats[pos.playerId] = {
            name: pos.playerName,
            total: 0,
            asGK: 0,
            asField: 0
          };
        }
        
        stats[pos.playerId].total += 1;
        
        if (pos.position === 'GK') {
          stats[pos.playerId].asGK += 1;
        } else {
          stats[pos.playerId].asField += 1;
        }
      });
    });
    
    return Object.entries(stats).map(([id, stat]) => ({
      playerId: parseInt(id),
      ...stat
    })).sort((a, b) => b.total - a.total);
  }, [matchLineups]);

  const deleteLineup = (lineupId: number) => {
    showConfirm('このメンバー選出を削除しますか?', () => {
      const newLineups = data.lineups.filter(l => l.id !== lineupId);
      setData(prev => ({
        ...prev,
        lineups: newLineups
      }));
      
      const newMatchLineups = newLineups.filter(l => l.matchId === selectedMatch?.id);
      if (activeTab >= newMatchLineups.length && activeTab > 0) {
        setActiveTab(Math.max(0, newMatchLineups.length - 1));
      }
    });
  };

  const editLineup = (lineup: any) => {
    setLineupData({
      id: lineup.id,
      matchId: lineup.matchId,
      teamId: lineup.teamId,
      selectedPlayerIds: lineup.selectedPlayerIds,
      system: lineup.system,
      systemPositions: lineup.positions.map((p: any) => p.position),
      existingPositions: lineup.positions
    });
    router.push('/lineups/positions');
  };

  const startNewLineup = () => {
    setLineupData({
      selectedPlayerIds: selectedMatch?.selectedPlayerIds || [],
      matchId: selectedMatch?.id,
      teamId: selectedMatch?.teamId
    });
    router.push('/lineups/select-system');
  };

  const getGroupedPositions = (lineup: any) => {
    const grouped: Record<string, any[]> = {};
    lineup.positions.forEach((pos: any) => {
      const posType = pos.position.replace(/[0-9]/g, '');
      if (!grouped[posType]) grouped[posType] = [];
      grouped[posType].push(pos);
    });
    return grouped;
  };

  const positionOrder = ['FW', 'MF', 'DF', 'GK', 'FP'];
  const currentLineup = matchLineups[activeTab];

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={[commonStyles.header, { backgroundColor: currentTheme.primary }]}>
        <View style={commonStyles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={commonStyles.headerTitle}>メンバー選出</Text>
          <TouchableOpacity onPress={startNewLineup}>
            <Ionicons name="add-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ padding: 16, backgroundColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937' }}>
          {selectedMatch?.title}
        </Text>
        <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
          {selectedMatch?.datetime} / 全{matchLineups.length}本
        </Text>
      </View>

      {matchLineups.length === 0 ? (
        <View style={commonStyles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#d1d5db" />
          <Text style={commonStyles.emptyText}>メンバー選出がありません</Text>
        </View>
      ) : (
        <>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ 
              maxHeight: 60, 
              backgroundColor: '#fff',
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb'
            }}
          >
            <View style={{ flexDirection: 'row', padding: 8, gap: 8 }}>
              {matchLineups.map((lineup, index) => (
                <TouchableOpacity
                  key={lineup.id}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: activeTab === index ? currentTheme.primary : '#f3f4f6',
                    borderWidth: 1,
                    borderColor: activeTab === index ? currentTheme.primary : '#e5e7eb'
                  }}
                  onPress={() => setActiveTab(index)}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: activeTab === index ? '#fff' : '#6b7280'
                  }}>
                    {index + 1}本目
                  </Text>
                  <Text style={{
                    fontSize: 12,
                    color: activeTab === index ? '#fff' : '#9ca3af',
                    marginTop: 2
                  }}>
                    {lineup.system}
                  </Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                  backgroundColor: activeTab === matchLineups.length ? '#10b981' : '#f3f4f6',
                  borderWidth: 1,
                  borderColor: activeTab === matchLineups.length ? '#10b981' : '#e5e7eb'
                }}
                onPress={() => setActiveTab(matchLineups.length)}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: activeTab === matchLineups.length ? '#fff' : '#6b7280'
                }}>
                  出場本数
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <ScrollView style={{ flex: 1 }}>
            {activeTab === matchLineups.length ? (
              <View style={{ padding: 16 }}>
                <View style={{ 
                  backgroundColor: '#fff', 
                  borderRadius: 12, 
                  padding: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                  elevation: 2
                }}>
                  <View style={{ 
                    flexDirection: 'row', 
                    paddingBottom: 12, 
                    borderBottomWidth: 2,
                    borderBottomColor: '#e5e7eb'
                  }}>
                    <Text style={{ flex: 2, fontWeight: 'bold', color: '#1f2937' }}>選手名</Text>
                    <Text style={{ flex: 1, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
                      合計
                    </Text>
                    <Text style={{ flex: 1, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
                      GK
                    </Text>
                    <Text style={{ flex: 1, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' }}>
                      FP
                    </Text>
                  </View>
                  
                  {playerStats.map((stat, index) => (
                    <View 
                      key={stat.playerId}
                      style={{ 
                        flexDirection: 'row', 
                        paddingVertical: 12,
                        borderBottomWidth: index < playerStats.length - 1 ? 1 : 0,
                        borderBottomColor: '#f3f4f6',
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ flex: 2, color: '#1f2937', fontSize: 15 }}>
                        {stat.name}
                      </Text>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{
                          backgroundColor: currentTheme.primary,
                          borderRadius: 12,
                          paddingVertical: 4,
                          paddingHorizontal: 12,
                          minWidth: 36
                        }}>
                          <Text style={{ 
                            color: '#fff', 
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 14
                          }}>
                            {stat.total}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{
                          backgroundColor: stat.asGK > 0 ? '#f59e0b' : '#f3f4f6',
                          borderRadius: 12,
                          paddingVertical: 4,
                          paddingHorizontal: 12,
                          minWidth: 36
                        }}>
                          <Text style={{ 
                            color: stat.asGK > 0 ? '#fff' : '#9ca3af',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 14
                          }}>
                            {stat.asGK}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={{
                          backgroundColor: stat.asField > 0 ? '#10b981' : '#f3f4f6',
                          borderRadius: 12,
                          paddingVertical: 4,
                          paddingHorizontal: 12,
                          minWidth: 36
                        }}>
                          <Text style={{ 
                            color: stat.asField > 0 ? '#fff' : '#9ca3af',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            fontSize: 14
                          }}>
                            {stat.asField}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                
                <View style={{ 
                  marginTop: 16, 
                  padding: 12, 
                  backgroundColor: '#eff6ff',
                  borderRadius: 8
                }}>
                  <Text style={{ fontSize: 12, color: '#1e40af' }}>
                    💡 合計: 全ポジションの出場本数
                  </Text>
                  <Text style={{ fontSize: 12, color: '#1e40af', marginTop: 4 }}>
                    💡 GK: ゴールキーパーとしての出場本数
                  </Text>
                  <Text style={{ fontSize: 12, color: '#1e40af', marginTop: 4 }}>
                    💡 FP: フィールドプレーヤーとしての出場本数
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View style={{ 
                  padding: 16, 
                  backgroundColor: '#fff',
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb'
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontSize: 14, color: '#6b7280' }}>システム</Text>
                      <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1f2937', marginTop: 2 }}>
                        {currentLineup?.system}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#3b82f6',
                          borderRadius: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                        onPress={() => editLineup(currentLineup)}
                      >
                        <Ionicons name="create-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 4, fontSize: 14 }}>
                          編集
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#ef4444',
                          borderRadius: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 16,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                        onPress={() => deleteLineup(currentLineup.id)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#fff" />
                        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 4, fontSize: 14 }}>
                          削除
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={{ padding: 16, backgroundColor: '#16a34a20' }}>
                  <View style={{
                    backgroundColor: '#16a34a',
                    borderRadius: 12,
                    padding: 20,
                    minHeight: 400
                  }}>
                    {positionOrder.map(posType => {
                      const groupedPositions = getGroupedPositions(currentLineup);
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
                            {posGroup.map((pos: any, index: number) => {
                              const playerStat = playerStats.find(s => s.playerId === pos.playerId);
                              return (
                                <View
                                  key={index}
                                  style={{
                                    backgroundColor: currentTheme.primary,
                                    borderRadius: 25,
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                    minWidth: 100,
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: '#8b5cf6'
                                  }}
                                >
                                  <Text style={{
                                    fontSize: 10,
                                    color: '#fff',
                                    fontWeight: 'bold'
                                  }}>
                                    {pos.position}
                                  </Text>
                                  <Text style={{
                                    fontSize: 14,
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    marginTop: 2
                                  }}>
                                    {pos.playerName}
                                  </Text>
                                  {playerStat && (
                                    <View style={{ 
                                      flexDirection: 'row', 
                                      marginTop: 4,
                                      gap: 4
                                    }}>
                                      <View style={{
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        borderRadius: 8,
                                        paddingHorizontal: 6,
                                        paddingVertical: 2
                                      }}>
                                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                                          全{playerStat.total}
                                        </Text>
                                      </View>
                                      {pos.position !== 'GK' && (
                                        <View style={{
                                          backgroundColor: 'rgba(16,185,129,0.8)',
                                          borderRadius: 8,
                                          paddingHorizontal: 6,
                                          paddingVertical: 2
                                        }}>
                                          <Text style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>
                                            FP{playerStat.asField}
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  )}
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {(() => {
                  const benchPlayers = currentLineup.selectedPlayerIds
                    .filter((id: number) => !currentLineup.positions.some((pos: any) => pos.playerId === id))
                    .map((id: number) => {
                      const player = data.players.find(p => p.id === id);
                      const stat = playerStats.find(s => s.playerId === id);
                      return { ...player, stat };
                    })
                    .filter((p: any) => p);

                  if (benchPlayers.length === 0) return null;

                  return (
                    <View style={{ padding: 16 }}>
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#1f2937', marginBottom: 12 }}>
                        ベンチ ({benchPlayers.length}名)
                      </Text>
                      <View style={{ backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12 }}>
                        {benchPlayers.map((player: any) => (
                          <View 
                            key={player.id}
                            style={{ 
                              flexDirection: 'row', 
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 8
                            }}
                          >
                            <Text style={{ fontSize: 14, color: '#6b7280' }}>
                              {player.name}
                            </Text>
                            {player.stat && (
                              <View style={{ flexDirection: 'row', gap: 4 }}>
                                <View style={{
                                  backgroundColor: currentTheme.primary,
                                  borderRadius: 8,
                                  paddingHorizontal: 8,
                                  paddingVertical: 4
                                }}>
                                  <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>
                                    全{player.stat.total}
                                  </Text>
                                </View>
                                <View style={{
                                  backgroundColor: '#10b981',
                                  borderRadius: 8,
                                  paddingHorizontal: 8,
                                  paddingVertical: 4
                                }}>
                                  <Text style={{ fontSize: 12, color: '#fff', fontWeight: 'bold' }}>
                                    FP{player.stat.asField}
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  );
                })()}
              </>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}
