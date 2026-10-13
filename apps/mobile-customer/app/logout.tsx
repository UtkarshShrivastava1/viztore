import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, LogOut, Lock, ShoppingCart, Bell, ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, clear auth state here
    router.push('/logged-out');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#0f172a" />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>Logout</Text>
            <Text style={styles.heroSubtitle}>Are you sure you want to logout from your account?</Text>
          </View>
          <View style={styles.heroIllustration}>
            {/* Mock Door Illustration */}
            <View style={styles.mockDoorFrame}>
               <View style={styles.mockDoor}>
                  <View style={styles.mockUserAvatar}>
                    <UserIcon />
                  </View>
                  <View style={styles.doorKnob} />
               </View>
            </View>
            <View style={styles.logoutIconFloat}>
              <LogOut size={20} color="#22c55e" />
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Logging out will</Text>
          
          <View style={styles.infoItem}>
            <View style={[styles.infoIconWrap, { backgroundColor: '#f3e8ff' }]}>
              <Lock size={20} color="#9333ea" />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoItemTitle}>Keep your account secure</Text>
              <Text style={styles.infoItemDesc}>You'll need to login again to access your account.</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={[styles.infoIconWrap, { backgroundColor: '#fee2e2' }]}>
              <ShoppingCart size={20} color="#ef4444" />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoItemTitle}>Log you out from all devices</Text>
              <Text style={styles.infoItemDesc}>You will be logged out from all devices for security.</Text>
            </View>
          </View>

          <View style={styles.infoItemLast}>
            <View style={[styles.infoIconWrap, { backgroundColor: '#dcfce7' }]}>
              <Bell size={20} color="#22c55e" />
            </View>
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoItemTitle}>Stop notifications</Text>
              <Text style={styles.infoItemDesc}>You may stop receiving account related notifications.</Text>
            </View>
          </View>
        </View>

        <View style={styles.safeSecureCard}>
          <View style={styles.safeSecureIcon}>
            <ShieldCheck size={24} color="#3b82f6" />
          </View>
          <View style={styles.safeSecureTextWrap}>
            <Text style={styles.safeSecureTitle}>Your data is safe with us</Text>
            <Text style={styles.safeSecureDesc}>We respect your privacy and ensure your data is always protected.</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={18} color="#ffffff" style={{marginRight: 8}} />
            <Text style={styles.logoutBtnText}>Yes, Logout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Simple internal icon for illustration
const UserIcon = () => (
  <View style={{alignItems: 'center', justifyContent: 'center'}}>
    <View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: '#818cf8', marginBottom: 2}} />
    <View style={{width: 22, height: 12, borderTopLeftRadius: 10, borderTopRightRadius: 10, backgroundColor: '#818cf8'}} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  content: { padding: 16 },
  heroSection: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  heroTextContainer: { flex: 1, paddingRight: 16 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  heroSubtitle: { fontSize: 14, color: '#475569', lineHeight: 20 },
  heroIllustration: { width: 120, height: 120, alignItems: 'flex-end', justifyContent: 'flex-end', position: 'relative' },
  mockDoorFrame: { width: 80, height: 110, borderWidth: 4, borderColor: '#cbd5e1', borderBottomWidth: 0, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#e2e8f0', position: 'relative' },
  mockDoor: { width: 72, height: 106, backgroundColor: '#f8fafc', position: 'absolute', bottom: 0, left: -10, borderTopLeftRadius: 4, borderTopRightRadius: 4, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', justifyContent: 'center', transform: [{perspective: 200}, {rotateY: '-15deg'}] },
  mockUserAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e7ff', alignItems: 'center', justifyContent: 'center' },
  doorKnob: { width: 6, height: 12, borderRadius: 3, backgroundColor: '#cbd5e1', position: 'absolute', right: 4, top: '50%' },
  logoutIconFloat: { position: 'absolute', left: 0, top: 20, backgroundColor: '#ffffff', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#22c55e40' },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  infoTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  infoItemLast: { flexDirection: 'row', alignItems: 'flex-start' },
  infoIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  infoTextWrap: { flex: 1 },
  infoItemTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  infoItemDesc: { fontSize: 13, color: '#64748b', lineHeight: 18 },
  safeSecureCard: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  safeSecureIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#3b82f6', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  safeSecureTextWrap: { flex: 1 },
  safeSecureTitle: { fontSize: 15, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
  safeSecureDesc: { fontSize: 12, color: '#475569', lineHeight: 18 },
  actionButtons: { gap: 12 },
  logoutBtn: { flexDirection: 'row', backgroundColor: '#fb3f5c', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  logoutBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  cancelBtn: { backgroundColor: '#ffffff', paddingVertical: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#3b82f6' },
  cancelBtnText: { color: '#3b82f6', fontSize: 16, fontWeight: '700' },
});
