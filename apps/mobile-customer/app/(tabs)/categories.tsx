import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';

const CATEGORIES = [
  'Grocery & Staples',
  'Fruits & Vegetables',
  'Dairy & Bakery',
  'Fashion & Apparel',
  'Electronics',
  'Personal Care',
  'Home & Kitchen',
];

export default function CategoriesScreen() {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
      </View>
      <View style={styles.splitLayout}>
        {/* Left Vertical Rail */}
        <ScrollView style={styles.rail}>
          {CATEGORIES.map((cat) => {
            const isActive = cat === selectedCat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.railItem, isActive && styles.railItemActive]}
                onPress={() => setSelectedCat(cat)}
              >
                <Text style={[styles.railText, isActive && styles.railTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Right Subcategory Grid */}
        <ScrollView style={styles.content}>
          <Text style={styles.contentTitle}>{selectedCat}</Text>
          <View style={styles.subGrid}>
            {['Atta & Flours', 'Rice & Grains', 'Dals & Pulses', 'Edible Oils', 'Spices & Masalas', 'Dry Fruits'].map(
              (sub) => (
                <TouchableOpacity key={sub} style={styles.subCard}>
                  <View style={styles.subImagePlaceholder} />
                  <Text style={styles.subName}>{sub}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#081028' },
  splitLayout: { flex: 1, flexDirection: 'row' },
  rail: { width: 110, backgroundColor: '#f8fafc', borderRightWidth: 1, borderColor: '#e2e8f0' },
  railItem: { paddingVertical: 14, paddingHorizontal: 10, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  railItemActive: { backgroundColor: '#ffffff', borderLeftWidth: 3, borderLeftColor: '#f97316' },
  railText: { fontSize: 11, color: '#64748b', fontWeight: '500' },
  railTextActive: { color: '#081028', fontWeight: '700' },
  content: { flex: 1, padding: 16 },
  contentTitle: { fontSize: 14, fontWeight: '700', color: '#081028', marginBottom: 12 },
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  subCard: { width: '47%', backgroundColor: '#f8fafc', borderRadius: 10, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  subImagePlaceholder: { width: 50, height: 50, backgroundColor: '#e2e8f0', borderRadius: 25, marginBottom: 6 },
  subName: { fontSize: 11, fontWeight: '600', color: '#334155', textAlign: 'center' },
});
