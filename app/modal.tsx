import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937' }}>This is a modal</View>
      <Link href="/" dismissTo style={styles.link}>
        <View style={{ fontSize: 16, color: '#2563eb' }}>Go to home screen</View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
