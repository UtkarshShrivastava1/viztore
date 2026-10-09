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
  CheckCircle2,
  Share2,
  Download,
  CreditCard,
  MessageSquare,
  HeadphonesIcon,
  ShieldCheck,
  ChevronRight
} from 'lucide-react-native';
import { branding } from '@repo/shared-types';
import { useRouter } from 'expo-router';

export default function OrderDetailsScreen() {
  const router = useRouter();

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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButtonTop}>
              <ChevronLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitleTop}>Order Details</Text>
            <View style={{width: 24}} />
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Title Area (overriding the exact header due to image layout difference, let's just use the white background area) */}
      <View style={styles.pageTitleRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#1d4ed8" />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Order Details</Text>
          <Text style={styles.pageSubtitle}>Track and manage your order</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <CheckCircle2 size={18} color="#16a34a" />
          <Text style={styles.statusBannerText}>Delivered on 08 May 2024, 10:30 AM</Text>
        </View>

        {/* Order Item Card */}
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <View>
              <Text style={styles.orderId}>Order ID: #ORD-123456789</Text>
              <Text style={styles.orderDate}>08 May 2024, 10:30 AM</Text>
            </View>
            <View style={styles.orderStatusWrap}>
              <Text style={[styles.orderStatus, { color: '#16a34a' }]}>Delivered</Text>
              <CheckCircle2 size={16} color="#16a34a" style={{ marginLeft: 4 }} />
            </View>
          </View>

          <View style={styles.orderContent}>
            <View style={styles.orderImagePlaceholder}>
              <View style={{width: 60, height: 60, backgroundColor: '#f1f5f9', borderRadius: 8}} />
            </View>
            <View style={styles.orderDetailsWrap}>
              <View style={styles.orderTitleRow}>
                <Text style={styles.orderProduct} numberOfLines={1}>Men Graphic Print T-shirt</Text>
                <TouchableOpacity style={styles.shareBtn}>
                  <Share2 size={16} color="#1d4ed8" />
                </TouchableOpacity>
              </View>
              <Text style={styles.orderDetails}>Olive Green • Size: L • Qty: 1</Text>
              <Text style={styles.orderPrice}>₹399</Text>
            </View>
          </View>

          <View style={styles.orderFooter}>
            <Text style={styles.orderTotalLabel}>Total Amount: <Text style={styles.orderTotalValue}>₹399</Text></Text>
            <View style={styles.footerBtns}>
              <TouchableOpacity style={styles.outlineBtn}>
                <Download size={14} color="#3b82f6" style={{marginRight: 6}} />
                <Text style={styles.outlineBtnText}>Download Bill</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Buy Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* OTP Card */}
        <View style={styles.otpCard}>
          <View style={styles.otpLeft}>
            <View style={styles.otpIconWrap}>
              <ShieldCheck size={24} color="#3b82f6" />
            </View>
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.otpTitle}>Delivery OTP</Text>
                <View style={styles.otpBadge}><Text style={styles.otpBadgeText}>Show to delivery partner</Text></View>
              </View>
              <Text style={styles.otpSubtitle}>Share this OTP with the delivery partner to confirm successful delivery</Text>
            </View>
          </View>
          <View style={styles.otpRight}>
            <Text style={styles.otpRightTitle}>Your Delivery OTP</Text>
            <Text style={styles.otpNumbers}>7 3 8 2 1 6</Text>
            <Text style={styles.otpWarning}>This OTP is unique for this order.</Text>
          </View>
        </View>

        {/* Tracking */}
        <View style={styles.trackingCard}>
          <Text style={styles.sectionTitle}>Order Tracking</Text>
          
          <View style={styles.trackingStep}>
            <View style={styles.trackLineWrap}>
              <View style={styles.trackDotActive} />
              <View style={styles.trackLineActive} />
            </View>
            <View style={styles.trackContent}>
              <Text style={styles.trackTitle}>Order Confirmed</Text>
              <Text style={styles.trackDate}>08 May 2024, 10:30 AM</Text>
            </View>
          </View>
          <View style={styles.trackingStep}>
            <View style={styles.trackLineWrap}>
              <View style={styles.trackDotActive} />
              <View style={styles.trackLineActive} />
            </View>
            <View style={styles.trackContent}>
              <Text style={styles.trackTitle}>Packed</Text>
              <Text style={styles.trackDate}>08 May 2024, 02:15 PM</Text>
            </View>
          </View>
          <View style={styles.trackingStep}>
            <View style={styles.trackLineWrap}>
              <View style={styles.trackDotActive} />
              <View style={styles.trackLineActive} />
            </View>
            <View style={styles.trackContent}>
              <Text style={styles.trackTitle}>Out for Delivery</Text>
              <Text style={styles.trackDate}>08 May 2024, 09:45 AM</Text>
            </View>
          </View>
          <View style={styles.trackingStep}>
            <View style={styles.trackLineWrap}>
              <View style={styles.trackDotActive} />
            </View>
            <View style={styles.trackContent}>
              <Text style={[styles.trackTitle, {color: '#16a34a'}]}>Delivered</Text>
              <Text style={styles.trackDate}>08 May 2024, 10:30 AM</Text>
            </View>
          </View>
          
          <View style={styles.trackingSuccessMsg}>
            <CheckCircle2 size={16} color="#16a34a" />
            <Text style={styles.trackingSuccessText}>Your order has been delivered. Thank you for shopping with {branding.appName}!</Text>
          </View>
        </View>

        {/* Address */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Text style={styles.linkText}>View on Map</Text>
          </View>
          <View style={styles.addressRow}>
            <View style={styles.addressIconWrap}>
              <MapPin size={20} color="#3b82f6" />
            </View>
            <View>
              <Text style={styles.addressName}>Harish Kumar</Text>
              <Text style={styles.addressText}>123, MG Road, Near City Mall</Text>
              <Text style={styles.addressText}>Indore, Madhya Pradesh - 452001</Text>
              <Text style={styles.addressText}>Phone: +91 98765 43210</Text>
            </View>
          </View>
        </View>

        {/* Payment */}
        <View style={styles.infoCard}>
          <Text style={[styles.sectionTitle, {marginBottom: 16}]}>Payment Summary</Text>
          <View style={styles.addressRow}>
            <View style={styles.addressIconWrap}>
              <CreditCard size={20} color="#3b82f6" />
            </View>
            <View style={{flex: 1}}>
              <View style={styles.billRow}><Text style={styles.billLabel}>Payment Method</Text><Text style={styles.billValue}>UPI</Text></View>
              <View style={styles.billRow}><Text style={styles.billLabel}>Subtotal</Text><Text style={styles.billValue}>₹399</Text></View>
              <View style={styles.billRow}><Text style={styles.billLabel}>Delivery Charges</Text><Text style={[styles.billValue, {color: '#16a34a'}]}>FREE</Text></View>
              <View style={[styles.billRow, styles.billTotalRow]}>
                <Text style={styles.billTotalLabel}>Total Amount</Text>
                <Text style={styles.billTotalValue}>₹399</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.actionListItem}>
          <View style={[styles.actionListIconWrap, {backgroundColor: '#ffedd5'}]}>
            <MessageSquare size={20} color="#f97316" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.actionListTitle}>Feedback</Text>
            <Text style={styles.actionListDesc}>Share your experience and help us improve</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionListItem, {marginTop: 12}]}>
          <View style={[styles.actionListIconWrap, {backgroundColor: '#f3e8ff'}]}>
            <HeadphonesIcon size={20} color="#9333ea" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.actionListTitle}>Need Help?</Text>
            <Text style={styles.actionListDesc}>Contact our support team for any queries</Text>
          </View>
          <ChevronRight size={20} color="#94a3b8" />
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerGradient: { paddingTop: Platform.OS === 'android' ? 40 : 0 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  backButtonTop: { padding: 4 },
  headerTitleTop: { color: '#ffffff', fontSize: 18, fontWeight: '700' },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16, gap: 12 },
  backButton: { padding: 4 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1e3a8a' },
  pageSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  scrollContent: { padding: 16 },
  statusBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#dcfce7', padding: 12, borderRadius: 8, gap: 8, marginBottom: 16 },
  statusBannerText: { color: '#16a34a', fontSize: 13, fontWeight: '600' },
  orderCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderId: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  orderDate: { fontSize: 11, color: '#64748b', marginTop: 2 },
  orderStatusWrap: { flexDirection: 'row', alignItems: 'center' },
  orderStatus: { fontSize: 12, fontWeight: '700' },
  orderContent: { flexDirection: 'row', marginBottom: 16 },
  orderImagePlaceholder: { marginRight: 12 },
  orderDetailsWrap: { flex: 1 },
  orderTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderProduct: { fontSize: 14, fontWeight: '700', color: '#1e3a8a', flex: 1 },
  shareBtn: { padding: 6, backgroundColor: '#eff6ff', borderRadius: 16 },
  orderDetails: { fontSize: 11, color: '#64748b', marginTop: 4, marginBottom: 8 },
  orderPrice: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
  orderTotalLabel: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  orderTotalValue: { color: '#0f172a', fontWeight: '800' },
  footerBtns: { flexDirection: 'row', gap: 8 },
  outlineBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: '#3b82f6' },
  outlineBtnText: { color: '#3b82f6', fontSize: 12, fontWeight: '700' },
  primaryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6, backgroundColor: '#3b82f6' },
  primaryBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
  otpCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9', flexDirection: 'column', gap: 16 },
  otpLeft: { flexDirection: 'row', gap: 12, flex: 1, alignItems: 'flex-start' },
  otpIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  otpTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginRight: 8 },
  otpBadge: { backgroundColor: '#eff6ff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  otpBadgeText: { color: '#3b82f6', fontSize: 9, fontWeight: '600' },
  otpSubtitle: { fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 16, width: '90%' },
  otpRight: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  otpRightTitle: { fontSize: 11, color: '#64748b', fontWeight: '600', marginBottom: 4 },
  otpNumbers: { fontSize: 24, fontWeight: '800', color: '#1e40af', letterSpacing: 6 },
  otpWarning: { fontSize: 10, color: '#ef4444', marginTop: 4, fontWeight: '600' },
  trackingCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  trackingStep: { flexDirection: 'row', marginBottom: 16 },
  trackLineWrap: { alignItems: 'center', marginRight: 12, width: 16 },
  trackDotActive: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#16a34a' },
  trackLineActive: { width: 2, flex: 1, backgroundColor: '#16a34a', marginTop: 4, minHeight: 30 },
  trackContent: { flex: 1 },
  trackTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  trackDate: { fontSize: 11, color: '#64748b', marginTop: 2 },
  trackingSuccessMsg: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 8, gap: 8, marginTop: 8 },
  trackingSuccessText: { color: '#16a34a', fontSize: 11, fontWeight: '600', flex: 1 },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#f1f5f9' },
  infoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  linkText: { color: '#3b82f6', fontSize: 12, fontWeight: '600' },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start' },
  addressIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  addressName: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  addressText: { fontSize: 12, color: '#64748b', marginBottom: 2 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 12, color: '#64748b' },
  billValue: { fontSize: 12, fontWeight: '600', color: '#0f172a' },
  billTotalRow: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, marginTop: 4 },
  billTotalLabel: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  billTotalValue: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
  actionListItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
  actionListIconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  actionListTitle: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginBottom: 2 },
  actionListDesc: { fontSize: 11, color: '#64748b' }
});
