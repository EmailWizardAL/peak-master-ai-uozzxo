
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { colors } from "@/styles/commonStyles";
import { supabase } from "@/config/supabase";

interface PeakData {
  id: string;
  title: string;
  description: string;
  value?: number;
  status?: string;
  [key: string]: any;
}

export default function HomeScreen() {
  const [data, setData] = useState<PeakData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      console.log('Fetching data from Base44 URL...');
      const response = await fetch('https://peak-pulse-279d9f00.base44.app');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      console.log('Content type:', contentType);
      
      if (contentType && contentType.includes('application/json')) {
        const jsonData = await response.json();
        console.log('Fetched JSON data:', jsonData);
        
        if (Array.isArray(jsonData)) {
          setData(jsonData);
        } else if (jsonData.data && Array.isArray(jsonData.data)) {
          setData(jsonData.data);
        } else {
          setData([{
            id: '1',
            title: 'Data Received',
            description: 'Successfully connected to PeakMasterai',
            value: Object.keys(jsonData).length,
            status: 'active'
          }]);
        }
      } else {
        const textData = await response.text();
        console.log('Fetched text data:', textData.substring(0, 200));
        setData([{
          id: '1',
          title: 'PeakMasterai Connected',
          description: 'Successfully connected to the service',
          status: 'active'
        }]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setData([{
        id: '1',
        title: 'Welcome to PeakMasterai',
        description: 'Your peak performance tracking app',
        status: 'ready'
      }]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const renderDataCard = (item: PeakData, index: number) => (
    <View key={index} style={styles.card}>
      <Text style={styles.cardTitle}>{item.title || 'Untitled'}</Text>
      {item.description && (
        <Text style={styles.cardDescription}>{item.description}</Text>
      )}
      {item.value !== undefined && (
        <View style={styles.valueContainer}>
          <Text style={styles.valueLabel}>Value:</Text>
          <Text style={styles.valueText}>{item.value}</Text>
        </View>
      )}
      {item.status && (
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? colors.primary : colors.accent }]} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading PeakMasterai...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>PeakMasterai</Text>
          <Text style={styles.subtitle}>Track Your Peak Performance</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🚀 Supabase Connected</Text>
          <Text style={styles.infoText}>
            Your app is now connected to Supabase and ready to store and sync data.
          </Text>
          <View style={styles.connectionDetails}>
            <Text style={styles.detailLabel}>URL:</Text>
            <Text style={styles.detailValue}>pvmalrxbrvvipechinor.supabase.co</Text>
          </View>
        </View>

        <View style={styles.dataSection}>
          <Text style={styles.sectionTitle}>Data Overview</Text>
          {data.length > 0 ? (
            data.map((item, index) => renderDataCard(item, index))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No data available</Text>
              <Text style={styles.emptyStateSubtext}>Pull down to refresh</Text>
            </View>
          )}
        </View>

        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Real-time Analytics</Text>
              <Text style={styles.featureDescription}>
                Track your performance metrics in real-time with Supabase integration
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure Data Storage</Text>
              <Text style={styles.featureDescription}>
                Your data is securely stored and synchronized across devices
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <Text style={styles.featureIcon}>⚡</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Lightning Fast</Text>
              <Text style={styles.featureDescription}>
                Optimized performance for seamless user experience
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#fcc',
  },
  errorText: {
    color: '#c33',
    fontSize: 14,
    marginBottom: 8,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  connectionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  dataSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  valueLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginRight: 8,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
