import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Heart,
  ShoppingCart,
  MapPin,
  ChevronDown,
  Search,
  Mic,
  Bell,
  ChevronLeft,
  User,
  Plus,
  Home,
  Briefcase,
  Store,
  Pencil,
  Trash2,
  CheckCircle2,
  Circle,
  ShieldCheck
} from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { useRouter } from 'expo-router';

export default function AddressesScreen() {
  const router = useRouter();

  const addresses = [
    {
      id: '1',
      type: 'Home',
      icon: Home,
      iconColor: '#3b82f6',
      iconBg: '#eff6ff',
      name: 'Harish Kumar',
      address: 'House No. 123, Boring Road,\nPatna, Bihar - 800001\nIndia',
      phone: '+91 91234 56789',
      isDefault: true
    },
    {
      id: '2',
      type: 'Work',
      icon: Briefcase,
      iconColor: '#f97316',
      iconBg: '#ffedd5',
      name: 'Harish Kumar',
      address: 'Zager Technologies Pvt. Ltd.,\n3rd Floor, West Boring Canal Road,\nPatna, Bihar - 800001\nIndia',
      phone: '+91 91234 56789',
      isDefault: false
    },
    {
      id: '3',
      type: 'Parents Home',
      icon: MapPin,
      iconColor: '#22c55e',
      iconBg: '#dcfce7',
      name: 'Harish Kumar',
      address: 'House No. 45, Park Road,\nKankarbagh, Patna, Bihar - 800020\nIndia',
      phone: '+91 91234 56789',
      isDefault: false
    },
    {
      id: '4',
      type: 'Other',
      icon: Store,
      iconColor: '#9333ea',
      iconBg: '#f3e8ff',
      name: 'Harish Kumar',
      address: 'Flat No. 5B, Shanti Apartments,\nExhibition Road, Patna, Bihar - 800001\nIndia',
      phone: '+91 91234 56789',
      isDefault: false
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header Gradient */}
      <LinearGradient
        colors={['#081028', '#1e3a8a', '#3b82f6', '#f8fafc']}
        locations={[0, 0.4, 0.7, 1]}
        style={styles.headerGradient}
      >
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIconContainer}>
                <View style={[styles.logoIconLayer, { backgroundColor: '#38bdf8', left: 0 }]} />
                <View style={[styles.logoIconLayer, { backgroundColor: '#f59e0b', left: 6 }]} />
              </View>
              <View>
                <Text style={styles.logoText}>{branding.appName}</Text>
                <Text style={styles.logoSubtext}>Making Local Stores Visible</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Heart size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <ShoppingCart size={24} color="#ffffff" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.locationProfileRow}>
            <TouchableOpacity style={styles.locationContainer}>
              <MapPin size={14} color="#ffffff" />
              <Text style={styles.locationText} numberOfLines={1}>
                Deliver to Harish Kumar - Q No- 6/B, Street -13, Sector -2, Bhilai
              </Text>
              <ChevronDown size={14} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.profileActions}>
              <TouchableOpacity style={styles.iconButton}>
                <Bell size={24} color="#ffffff" />
                <View style={styles.badgeRed}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <User size={18} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchBarContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#3b82f6" />
              <TextInput
                placeholder="Search for products, stores and more..."
                placeholderTextColor="#94a3b8"
                style={styles.searchInput}
              />
              <Mic size={20} color="#94a3b8" />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Page Title */}
      <View style={styles.pageTitleRow}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1d4ed8" />
          </TouchableOpacity>
          <View style={{marginLeft: 8}}>
            <Text style={styles.pageTitle}>My Addresses</Text>
            <Text style={styles.pageSubtitle}>Manage your saved addresses</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add-address')}>
          <Plus size={16} color="#2563eb" />
          <Text style={styles.addBtnText}>Add New Address</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {addresses.map((address) => {
          const Icon = address.icon;
          return (
            <View key={address.id} style={[styles.addressCard, address.isDefault && styles.addressCardDefault]}>
              <View style={styles.addressCardLeft}>
                <View style={[styles.iconWrap, {backgroundColor: address.iconBg}]}>
                  <Icon size={24} color={address.iconColor} />
                </View>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.addressCardRight}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressType}>{address.type}</Text>
                  <View style={styles.addressActions}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Pencil size={14} color="#2563eb" />
                      <Text style={styles.actionBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteBtn}>
                      <Trash2 size={16} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressText}>{address.address}</Text>
                
                <View style={styles.addressFooter}>
                  <Text style={styles.addressPhone}>{address.phone}</Text>
                  <View style={styles.checkboxWrap}>
                    {address.isDefault ? (
                      <CheckCircle2 size={18} color="#2563eb" fill="#eff6ff" />
                    ) : (
                      <Circle size={18} color="#94a3b8" />
                    )}
                    <Text style={styles.checkboxText}>{address.isDefault ? 'Default Address' : 'Set as Default'}</Text>
                  </View>
                </View>
              </View>
            </View>
          );
        })}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <ShieldCheck size={24} color="#2563eb" style={styles.infoIcon} />
          <View style={styles.infoTextWrap}>
            <Text style={styles.infoTitle}>Your addresses are 100% secure</Text>
            <Text style={styles.infoSubtitle}>We never share your addresses with anyone.</Text>
          </View>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerGradient: { paddingTop: Platform.OS === 'android' ? 40 : 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIconContainer: { width: 24, height: 24, position: 'relative', marginRight: 4 },
  logoIconLayer: { width: 14, height: 24, borderRadius: 6, position: 'absolute', transform: [{ skewX: '-15deg' }] },
  logoText: { color: '#ffffff', fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  logoSubtext: { color: '#cbd5e1', fontSize: 9 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconButton: { position: 'relative' },
  badge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#3b82f6', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#081028' },
  badgeRed: { position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#081028' },
  badgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold' },
  locationProfileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 16 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 24, gap: 6, flex: 1, marginRight: 16 },
  locationText: { color: '#ffffff', fontSize: 11, flex: 1 },
  profileActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  searchBarContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 24, paddingHorizontal: 16, height: 48, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a' },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  backButton: { padding: 4, marginLeft: -8 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
  scrollContent: { padding: 16 },
  addressCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  addressCardDefault: { borderColor: '#bfdbfe', backgroundColor: '#fafafa' },
  addressCardLeft: { width: 50, alignItems: 'center', marginRight: 16, position: 'relative' },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  defaultBadge: { position: 'absolute', top: -12, backgroundColor: '#bfdbfe', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  defaultBadgeText: { color: '#1e3a8a', fontSize: 9, fontWeight: '700' },
  addressCardRight: { flex: 1 },
  addressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  addressType: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  addressActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionBtnText: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
  deleteBtn: { padding: 2 },
  addressName: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 4 },
  addressText: { fontSize: 12, color: '#64748b', lineHeight: 20, marginBottom: 12 },
  addressFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  addressPhone: { fontSize: 13, color: '#334155' },
  checkboxWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  checkboxText: { fontSize: 11, color: '#0f172a', fontWeight: '500' },
  infoBox: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 8, alignItems: 'flex-start' },
  infoIcon: { marginTop: 2, marginRight: 12 },
  infoTextWrap: { flex: 1 },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
  infoSubtitle: { fontSize: 11, color: '#64748b' }
});
