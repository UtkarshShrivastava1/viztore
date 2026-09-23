import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { MapPin, Star, Clock } from 'lucide-react-native';

export default function StoresScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Stores Near You</Text>
        <Text style={styles.headerSub}>Within 3-4 km hyperlocal radius</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {[
          { name: 'Fresh Mart Supermarket', category: 'Grocery & Gourmet', dist: '0.4 km', time: '15-20 min', rating: '4.8', items: '2,400+ items' },
          { name: 'City Grocers & Bakery', category: 'Bakery & Provisions', dist: '0.8 km', time: '20-25 min', rating: '4.6', items: '1,100+ items' },
          { name: 'Fashion Hub Retail', category: 'Clothing & Accessories', dist: '1.2 km', time: '30-35 min', rating: '4.9', items: '850+ items' },
          { name: 'Apollo Care Pharmacy', category: 'Health & Wellness', dist: '1.5 km', time: '15-20 min', rating: '4.7', items: '3,200+ items' },
        ].map((store) => (
          <TouchableOpacity key={store.name} style={styles.storeCard}>
            <View style={styles.storeBanner} />
            <View style={styles.storeBody}>
              <View style={styles.titleRow}>
                <Text style={styles.storeName}>{store.name}</Text>
                <View style={styles.ratingBadge}>
                  <Star size={11} color="#f59e0b" fill="#f59e0b" />
                  <Text style={styles.ratingText}>{store.rating}</Text>
                </View>
              </View>
              <Text style={styles.storeCategory}>{store.category} • {store.items}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.pill}>
                  <MapPin size={11} color="#64748b" />
                  <Text style={styles.pillText}>{store.dist}</Text>
                </View>
                <View style={styles.pill}>
                  <Clock size={11} color="#16a34a" />
                  <Text style={[styles.pillText, { color: '#16a34a' }]}>{store.time}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#081028' },
  headerSub: { fontSize: 12, color: '#64748b', marginTop: 2 },
  content: { padding: 16, gap: 12 },
  storeCard: { backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  storeBanner: { height: 110, backgroundColor: '#e2e8f0' },
  storeBody: { padding: 12 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  storeName: { fontSize: 14, fontWeight: '700', color: '#081028' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#b45309' },
  storeCategory: { fontSize: 12, color: '#64748b', marginTop: 4 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pillText: { fontSize: 11, color: '#475569', fontWeight: '600' },
});
