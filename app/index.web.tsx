
import React, { useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { colors } from "@/styles/commonStyles";

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);

  const handleLoad = () => {
    console.log('iframe: Load completed');
    setLoading(false);
    setError(null);
  };

  const handleError = () => {
    console.error('iframe: Load error');
    setError('Failed to load PeakMasterai. Please check your internet connection.');
    setLoading(false);
  };

  const handleReload = () => {
    console.log('iframe: Reloading');
    setIframeKey(prev => prev + 1);
    setError(null);
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PeakMasterai</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={handleReload}
          >
            <Text style={styles.headerButtonText}>🔄 Reload</Text>
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

      <View style={styles.iframeContainer}>
        <iframe
          key={iframeKey}
          src="https://peak-pulse-279d9f00.base44.app"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block',
          }}
          onLoad={handleLoad}
          onError={handleError}
          title="PeakMasterai"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-downloads"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    height: '100vh',
    width: '100vw',
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
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
    cursor: 'pointer',
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
    cursor: 'pointer',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  iframeContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});
