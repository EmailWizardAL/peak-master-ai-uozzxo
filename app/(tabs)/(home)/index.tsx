
import React, { useState, useRef, useCallback, useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Platform, BackHandler, Alert } from "react-native";
import { WebView } from 'react-native-webview';
import { colors } from "@/styles/commonStyles";
import { logWebViewEvent } from "@/utils/webViewLogger";

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
      logWebViewEvent.goBack();
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  }, [canGoBack]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onAndroidBackPress);
      };
    }
  }, [onAndroidBackPress]);

  const handleLoadStart = () => {
    logWebViewEvent.loadStart(currentUrl);
    setLoading(true);
    setError(null);
  };

  const handleLoadEnd = () => {
    logWebViewEvent.loadEnd(currentUrl);
    setLoading(false);
  };

  const handleLoadProgress = ({ nativeEvent }: any) => {
    logWebViewEvent.loadProgress(nativeEvent.progress, nativeEvent.url);
    setCanGoBack(nativeEvent.canGoBack);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    logWebViewEvent.error(nativeEvent, currentUrl);
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
    logWebViewEvent.httpError(nativeEvent.statusCode, nativeEvent.url);
    if (nativeEvent.statusCode >= 400) {
      setError(`HTTP Error ${nativeEvent.statusCode}`);
    }
  };

  const handleReload = () => {
    logWebViewEvent.reload();
    setWebViewKey(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  const handleNavigationStateChange = (navState: any) => {
    logWebViewEvent.navigationChange(navState.url, navState.canGoBack, navState.canGoForward);
    setCurrentUrl(navState.url);
    setCanGoBack(navState.canGoBack);
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      logWebViewEvent.message('Received message from WebView', data);
    } catch (e) {
      logWebViewEvent.message('Received non-JSON message', event.nativeEvent.data);
    }
  };

  // JavaScript to inject into the WebView for debugging and compatibility
  const injectedJavaScript = `
    (function() {
      console.log('PeakMasterai WebView initialized');
      
      // Send debug info back to React Native
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'debug',
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
        console.log('DOM Content Loaded');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'domReady',
          timestamp: new Date().toISOString()
        }));
      });
      
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
        bounces={true}
        scrollEnabled={true}
        allowsBackForwardNavigationGestures={Platform.OS === 'ios'}
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
        userAgent={`Mozilla/5.0 (${Platform.OS === 'ios' ? 'iPhone; CPU iPhone OS 16_0 like Mac OS X' : 'Linux; Android 13'}) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36 PeakMasterai/1.0`}
        androidLayerType="hardware"
        androidHardwareAccelerationDisabled={false}
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primary,
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
