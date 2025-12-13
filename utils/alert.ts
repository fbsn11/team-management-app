// utils/alert.ts
import { Platform, Alert } from 'react-native';

export const showAlert = (message: string) => {
  if (Platform.OS === 'web') {
    alert(message);
  } else {
    Alert.alert('通知', message);
  }
};

export const showConfirm = (message: string, onConfirm: () => void) => {
  if (Platform.OS === 'web') {
    if (confirm(message)) {
      onConfirm();
    }
  } else {
    Alert.alert(
      '確認',
      message,
      [
        { text: 'キャンセル', style: 'cancel' },
        { text: 'OK', onPress: onConfirm }
      ]
    );
  }
};
