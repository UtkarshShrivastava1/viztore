import React, { useState } from 'react';
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
  ChevronLeft,
  MapPin,
  User,
  Phone,
  Home,
  Briefcase,
  Store,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function AddAddressScreen() {
  const router = useRouter();
  const [addressType, setAddressType] = useState('Home');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Simple header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#1d4ed8" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>Add New Address</Text>
          <Text style={styles.pageSubtitle}>Add your address details for a smooth delivery experience.</Text>

          <TouchableOpacity style={styles.currentLocationBox}>
            <View style={styles.currentLocationIcon}>
              <MapPin size={24} color="#2563eb" />
            </View>
            <View style={styles.currentLocationText}>
              <Text style={styles.currentLocationTitle}>Use my current location</Text>
              <Text style={styles.currentLocationSubtitle}>Auto-fill your address using your device's location.</Text>
            </View>
            <TouchableOpacity style={styles.useLocationBtn}>
              <MapPin size={14} color="#2563eb" />
              <Text style={styles.useLocationBtnText}>Use Current Location</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Form */}
          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>Full Name <Text style={styles.req}>*</Text></Text>
              <View style={styles.inputWrap}>
                <User size={18} color="#94a3b8" />
                <TextInput placeholder="Enter full name" style={styles.input} placeholderTextColor="#94a3b8" />
              </View>
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>Mobile Number <Text style={styles.req}>*</Text></Text>
              <View style={styles.inputWrap}>
                <Phone size={18} color="#94a3b8" />
                <TextInput placeholder="Enter 10-digit mobile number" style={styles.input} placeholderTextColor="#94a3b8" keyboardType="numeric" />
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>Pincode <Text style={styles.req}>*</Text></Text>
              <View style={styles.inputWrap}>
                <MapPin size={18} color="#94a3b8" />
                <TextInput placeholder="Enter pincode" style={styles.input} placeholderTextColor="#94a3b8" keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>Locality / Area <Text style={styles.req}>*</Text></Text>
              <View style={styles.inputWrap}>
                <MapPin size={18} color="#94a3b8" />
                <TextInput placeholder="Enter locality or area" style={styles.input} placeholderTextColor="#94a3b8" />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address (House No., Building, Street) <Text style={styles.req}>*</Text></Text>
            <View style={[styles.inputWrap, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
              <Home size={18} color="#94a3b8" style={{ marginTop: 2 }} />
              <TextInput placeholder="Enter house no., building name, street, etc." style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholderTextColor="#94a3b8" multiline />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>City / District / Town <Text style={styles.req}>*</Text></Text>
              <View style={styles.inputWrap}>
                <MapPin size={18} color="#94a3b8" />
                <TextInput placeholder="Enter city, district or town" style={styles.input} placeholderTextColor="#94a3b8" />
              </View>
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>State <Text style={styles.req}>*</Text></Text>
              <TouchableOpacity style={styles.inputWrap}>
                <MapPin size={18} color="#94a3b8" />
                <Text style={[styles.input, { color: '#0f172a', lineHeight: 20 }]}>-- Select State --</Text>
                <ChevronDown size={18} color="#0f172a" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.label}>Landmark (Optional)</Text>
              <View style={styles.inputWrap}>
                <MapPin size={18} color="#94a3b8" />
                <TextInput placeholder="Enter landmark (e.g. near school)" style={styles.input} placeholderTextColor="#94a3b8" />
              </View>
            </View>
            <View style={styles.formCol}>
              <Text style={styles.label}>Alternate Phone (Optional)</Text>
              <View style={styles.inputWrap}>
                <Phone size={18} color="#94a3b8" />
                <TextInput placeholder="Enter alternate phone number" style={styles.input} placeholderTextColor="#94a3b8" keyboardType="numeric" />
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Type <Text style={styles.req}>*</Text></Text>
            <View style={styles.typeRow}>
              <TouchableOpacity style={[styles.typeCard, addressType === 'Home' && styles.typeCardActive]} onPress={() => setAddressType('Home')}>
                <Home size={24} color={addressType === 'Home' ? '#2563eb' : '#64748b'} />
                <Text style={[styles.typeText, addressType === 'Home' && styles.typeTextActive]}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeCard, addressType === 'Work' && styles.typeCardActive]} onPress={() => setAddressType('Work')}>
                <Briefcase size={24} color={addressType === 'Work' ? '#2563eb' : '#64748b'} />
                <Text style={[styles.typeText, addressType === 'Work' && styles.typeTextActive]}>Work</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.typeCard, addressType === 'Other' && styles.typeCardActive]} onPress={() => setAddressType('Other')}>
                <Store size={24} color={addressType === 'Other' ? '#2563eb' : '#64748b'} />
                <Text style={[styles.typeText, addressType === 'Other' && styles.typeTextActive]}>Other</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.infoBox}>
            <ShieldCheck size={24} color="#2563eb" style={styles.infoIcon} />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoTitle}>Your information is safe with us</Text>
              <Text style={styles.infoSubtitle}>We never share your addresses with anyone.</Text>
            </View>
          </View>

        </ScrollView>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save Address</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 16, paddingBottom: 16 },
  backButton: { padding: 4, marginLeft: -8 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 20 },
  pageTitle: { fontSize: 24, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 20 },
  currentLocationBox: { flexDirection: 'row', backgroundColor: '#eff6ff', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 24 },
  currentLocationIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#dbeafe', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  currentLocationText: { flex: 1 },
  currentLocationTitle: { fontSize: 14, fontWeight: '700', color: '#1d4ed8' },
  currentLocationSubtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  useLocationBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#bfdbfe', gap: 4 },
  useLocationBtnText: { color: '#2563eb', fontSize: 11, fontWeight: '600' },
  formRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  formCol: { flex: 1 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '700', color: '#0f172a', marginBottom: 8 },
  req: { color: '#ef4444' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', height: 48, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, gap: 8 },
  input: { flex: 1, fontSize: 13, color: '#0f172a' },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeCard: { flex: 1, height: 80, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  typeCardActive: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  typeText: { fontSize: 13, fontWeight: '600', color: '#64748b', marginTop: 8 },
  typeTextActive: { color: '#2563eb' },
  infoBox: { flexDirection: 'row', backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, marginTop: 16, alignItems: 'flex-start' },
  infoIcon: { marginTop: 2, marginRight: 12 },
  infoTextWrap: { flex: 1 },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#1e3a8a', marginBottom: 4 },
  infoSubtitle: { fontSize: 11, color: '#64748b' },
  bottomActions: { padding: 16, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  saveBtn: { backgroundColor: '#0061ff', height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '700' },
  cancelBtn: { height: 48, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#cbd5e1' },
  cancelBtnText: { color: '#0f172a', fontSize: 15, fontWeight: '700' }
});
