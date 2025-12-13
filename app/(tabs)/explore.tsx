import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <View style={styles.titleContainer}>
        <Text
          style={{
            fontFamily: Fonts.rounded,
            fontSize: 28,
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
          Explore
        </Text>
      </View>
      <Text style={{ fontSize: 16, color: '#6b7280' }}>This app includes example code to help you get started.</Text>
      <Collapsible title="File-based routing">
        <Text style={{ fontSize: 16, color: '#6b7280' }}>
          This app has two screens:{' '}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>app/(tabs)/index.tsx</Text> and{' '}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>app/(tabs)/explore.tsx</Text>
        </Text>
        <Text style={{ fontSize: 16, color: '#6b7280' }}>
          The layout file in <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>app/(tabs)/_layout.tsx</Text>{' '}
          sets up the tab navigator.
        </Text>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Text style={{ fontSize: 16, color: '#2563eb' }}>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <Text style={{ fontSize: 16, color: '#6b7280' }}>
          You can open this project on Android, iOS, and the web. To open the web version, press{' '}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>w</Text> in the terminal running this project.
        </Text>
      </Collapsible>
      <Collapsible title="Images">
        <Text style={{ fontSize: 16, color: '#6b7280' }}>
          For static images, you can use the <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>@2x</Text> and{' '}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>@3x</Text> suffixes to provide files for
          different screen densities
        </Text>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <Text style={{ fontSize: 16, color: '#2563eb' }}>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <Text style={{ fontSize: 16, color: '#6b7280' }}>
          This template has light and dark mode support. The{' '}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>useColorScheme()</Text> hook lets you inspect
          what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
        </Text>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <Text style={{ fontSize: 16, color: '#2563eb' }}>Learn more</Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <Text style={{ fontSize: 16, color: '#6b7280' }}>
          This template includes an example of an animated component. The{' '}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>components/HelloWave.tsx</Text> component uses
          the powerful{' '}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', fontFamily: Fonts.mono }}>
            react-native-reanimated
          </Text>{' '}
          library to create a waving hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text style={{ fontSize: 16, color: '#6b7280' }}>
              The <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>components/ParallaxScrollView.tsx</Text>{' '}
              component provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
