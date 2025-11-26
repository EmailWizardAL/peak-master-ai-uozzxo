
import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, BackHandler, Alert } from "react-native";
import { WebView } from 'react-native-webview';
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewKey, setWebViewKey] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('https://peak-pulse-279d9f00.base44.app');
  const webViewRef = useRef<WebView>(null);

  // Handle Android hardware back button
  const onAndroidBackPress = useCallback(() => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
    return () => {
      backHandler.remove();
    };
  }, [onAndroidBackPress]);

  const handleLoadStart = () => {
    console.log('WebView: Load started');
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    console.log('WebView: Load ended');
    setLoading(false);
  };

  const handleLoadProgress = ({ nativeEvent }: any) => {
    console.log('WebView: Load progress:', nativeEvent.progress);
    setCanGoBack(nativeEvent.canGoBack);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError(`Failed to load: ${nativeEvent.description || 'Unknown error'}`);
    setLoading(false);
    
    // Show alert with error details
    Alert.alert(
      'Loading Error',
      `Could not load PeakMasterai.\n\nError: ${nativeEvent.description || 'Unknown error'}\n\nPlease check your internet connection and try again.`,
      [
        { text: 'Retry', onPress: handleReload }
      ]
    );
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView HTTP error:', nativeEvent);
    if (nativeEvent.statusCode >= 400) {
      setError(`HTTP Error ${nativeEvent.statusCode}`);
    }
  };

  const handleReload = () => {
    console.log('WebView: Reloading');
    setWebViewKey(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  const handleNavigationStateChange = (navState: any) => {
    console.log('WebView: Navigation state changed:', navState.url);
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
  };

  const handleMessage = (event: any) => {
    console.log('WebView: Message received:', event.nativeEvent.data);
  };

  // JavaScript to inject into the WebView for debugging and compatibility
  const injectedJavaScript = `
    (function() {
      console.log('PeakMasterai WebView initialized on Android');
      
      // Send debug info back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'debug',
        platform: 'android',
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }));
      
      // Log any JavaScript errors
      window.addEventListener('error', function(e) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'error',
          message: e.message,
          filename: e.filename,
          lineno: e.lineno
        }));
      });
      
      // Ensure all interactive elements are accessible
      document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM Content Loaded on Android');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'domReady',
          timestamp: new Date().toISOString()
        }));
      });
      
      // Fix touch events for Android
      document.addEventListener('touchstart', function() {}, {passive: true});
      
      true; // Required for injected JavaScript
    })();
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PeakMasterai</Text>
        <View style={styles.headerButtons}>
          {canGoBack && (
            <TouchableOpacity 
              style={[styles.headerButton, styles.backButton]} 
              onPress={() => webViewRef.current?.goBack()}
            >
              <Text style={styles.headerButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleReload}
          >
            <Text style={styles.headerButtonText}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.errorSubtext}>
            If you&apos;re seeing this error repeatedly, please ensure you have a stable internet connection.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReload}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading PeakMasterai...</Text>
          <Text style={styles.loadingSubtext}>Please wait</Text>
        </View>
      )}

      <WebView
        key={webViewKey}
        ref={webViewRef}
        source={{ uri: 'https://peak-pulse-279d9f00.base44.app' }}
        style={styles.webview}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={handleLoadProgress}
        onError={handleError}
        onHttpError={handleHttpError}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={true}
        mixedContentMode="always"
        originWhitelist={['*']}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        setSupportMultipleWindows={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        injectedJavaScript={injectedJavaScript}
        cacheEnabled={true}
        cacheMode="LOAD_DEFAULT"
        incognito={false}
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        userAgent="Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 PeakMasterai/1.0"
        androidLayerType="hardware"
        androidHardwareAccelerationDisabled={false}
        overScrollMode="never"
        nestedScrollEnabled={true}
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
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
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
    elevation: 2,
  },
  backButton: {
    backgroundColor: colors.secondary,
  },
  headerButtonText: {
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
    color: colors.text,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: '#fcc',
    elevation: 2,
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  errorSubtext: {
    color: '#c33',
    fontSize: 12,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
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
