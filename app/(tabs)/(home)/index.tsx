
import React, { useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import { WebView } from 'react-native-webview';
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewKey, setWebViewKey] = useState(0);

  const handleLoadStart = () => {
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('Failed to load PeakMasterai app');
    setLoading(false);
  };

  const handleReload = () => {
    setWebViewKey(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PeakMasterai</Text>
        <TouchableOpacity 
          style={styles.reloadButton} 
          onPress={handleReload}
        >
          <Text style={styles.reloadButtonText}>🔄 Reload</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading PeakMasterai...</Text>
        </View>
      )}

      <WebView
        key={webViewKey}
        source={{ uri: 'https://peak-pulse-279d9f00.base44.app' }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={true}
        scrollEnabled={true}
        allowsBackForwardNavigationGestures={true}
        mixedContentMode="always"
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  reloadButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  reloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#fcc',
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
