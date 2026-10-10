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
  Settings,
  ChevronRight,
  Briefcase,
  Truck,
  CheckCircle,
  RotateCcw,
  CalendarClock,
  ShoppingBag,
  User,
  ShieldCheck,
  Tag,
  MessageSquare,
  HeadphonesIcon,
  FileText,
  LogOut,
  Store,
  Star
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { branding } from '@repo/shared-types';

export default function AccountScreen() {
  const router = useRouter();
  const menuItems = [
    { label: 'Manage Addresses', subLabel: 'Manage your saved addresses', icon: MapPin, iconColor: '#3b82f6', href: '/addresses' },
    { label: 'Notifications', subLabel: 'View your notifications and updates', icon: Bell, iconColor: '#f59e0b', href: '/notifications' },
    { label: 'Wishlist', subLabel: 'View your favourite items', icon: Heart, iconColor: '#ef4444', href: '/wishlist' },
    { label: 'Coupons & Offers', subLabel: 'View available offers and discounts', icon: Tag, iconColor: '#22c55e', href: '/coupons' },
    { label: `Sell on ${branding.appName}`, subLabel: 'Start selling and grow your business', icon: Store, iconColor: '#3b82f6', isPromo: true, href: '/sell' },
    { label: 'Feedback', subLabel: 'Share your feedback with us', icon: MessageSquare, iconColor: '#f59e0b', href: '/feedback' },
    { label: 'Help & Support', subLabel: 'Get help or raise a ticket', icon: HeadphonesIcon, iconColor: '#f97316', href: '/help-support' },
    { label: 'Privacy Policy', subLabel: 'Read our privacy policy', icon: ShieldCheck, iconColor: '#3b82f6', href: '/privacy-policy' },
    { label: 'Terms & Conditions', subLabel: 'Read our terms and conditions', icon: FileText, iconColor: '#22c55e', href: '/terms-conditions' },
    { label: 'Logout', subLabel: 'Logout from your account', icon: LogOut, iconColor: '#ef4444', isLogout: true, href: '/logout' },
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
          {/* Top Row */}
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

          {/* Location & Profile Row */}
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

          {/* Search Bar */}
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <View style={styles.pageTitleRow}>
          <View>
            <Text style={styles.pageTitle}>My Account</Text>
            <Text style={styles.pageSubtitle}>Manage your profile, orders and preferences</Text>
          </View>
          <TouchableOpacity>
            <Settings size={22} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatarLarge}>
            <User size={36} color="#60a5fa" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Harish Kumar</Text>
            <Text style={styles.profileContact}>+91 91234 56789</Text>
            <Text style={styles.profileContact}>harishkumar@gmail.com</Text>
          </View>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('/edit-profile')}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
            <ChevronRight size={14} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* My Orders */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Orders</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>View All Orders {'>'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ordersStatsCard}>
          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: '#f3e8ff' }]}>
              <Briefcase size={22} color="#9333ea" />
            </View>
            <Text style={styles.statCount}>2</Text>
            <Text style={styles.statLabel}>All Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: '#ffedd5' }]}>
              <Truck size={22} color="#f97316" />
            </View>
            <Text style={styles.statCount}>1</Text>
            <Text style={styles.statLabel}>To Be Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: '#dcfce7' }]}>
              <CheckCircle size={22} color="#22c55e" />
            </View>
            <Text style={styles.statCount}>3</Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <View style={[styles.statIconWrap, { backgroundColor: '#fee2e2' }]}>
              <RotateCcw size={22} color="#ef4444" />
            </View>
            <Text style={styles.statCount}>0</Text>
            <Text style={styles.statLabel}>Returns</Text>
          </TouchableOpacity>
        </View>

        {/* Reserve & Pickup */}
        <View style={styles.actionCardsRow}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIconWrap, { backgroundColor: '#f3e8ff' }]}>
              <CalendarClock size={20} color="#9333ea" />
            </View>
            <View style={styles.actionCardText}>
              <Text style={styles.actionCardTitle}>Reserve Orders</Text>
              <Text style={styles.actionCardSubtitle}>View your reserved items</Text>
            </View>
            <ChevronRight size={18} color="#0f172a" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIconWrap, { backgroundColor: '#dcfce7' }]}>
              <ShoppingBag size={20} color="#22c55e" />
            </View>
            <View style={styles.actionCardText}>
              <Text style={styles.actionCardTitle}>Pickup Orders</Text>
              <Text style={styles.actionCardSubtitle}>View items to be picked up</Text>
            </View>
            <ChevronRight size={18} color="#0f172a" />
          </TouchableOpacity>
        </View>

        {/* Favourite Stores */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Favourite Stores</Text>
          <TouchableOpacity onPress={() => router.push('/favourite-stores')}>
            <Text style={styles.sectionLink}>View All Fav Stores</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storesScroll}>
          {/* Store 1 */}
          <View style={styles.storeCard}>
            <TouchableOpacity style={styles.storeHeartBtn}>
              <Heart size={14} color="#2563eb" />
            </TouchableOpacity>
            <View style={[styles.storeLogo, { backgroundColor: '#000' }]}>
              <Text style={[styles.storeLogoText, { color: '#fff' }]}>Fashion</Text>
              <Text style={[styles.storeLogoText, { color: '#fff' }]}>Hub</Text>
            </View>
            <Text style={styles.storeName}>Fashion Hub</Text>
            <Text style={styles.storeCategory}>Clothing, Accessories</Text>
            <View style={styles.storeRating}>
              <Star size={12} color="#22c55e" fill="#22c55e" />
              <Text style={styles.storeRatingScore}>4.5 <Text style={styles.storeRatingCount}>(1.2K)</Text></Text>
            </View>
          </View>

          {/* Store 2 */}
          <View style={styles.storeCard}>
            <TouchableOpacity style={styles.storeHeartBtn}>
              <Heart size={14} color="#2563eb" />
            </TouchableOpacity>
            <View style={[styles.storeLogo, { backgroundColor: '#064e3b' }]}>
              <Text style={[styles.storeLogoText, { color: '#fff' }]}>Tech</Text>
              <Text style={[styles.storeLogoText, { color: '#eab308' }]}>World</Text>
            </View>
            <Text style={styles.storeName}>Tech World</Text>
            <Text style={styles.storeCategory}>Electronics</Text>
            <View style={styles.storeRating}>
              <Star size={12} color="#22c55e" fill="#22c55e" />
              <Text style={styles.storeRatingScore}>4.3 <Text style={styles.storeRatingCount}>(856)</Text></Text>
            </View>
          </View>

          {/* Store 3 */}
          <View style={styles.storeCard}>
            <TouchableOpacity style={styles.storeHeartBtn}>
              <Heart size={14} color="#2563eb" />
            </TouchableOpacity>
            <View style={[styles.storeLogo, { backgroundColor: '#7f1d1d' }]}>
              <Store size={20} color="#fff" style={{marginBottom: 2}} />
              <Text style={[styles.storeLogoText, { color: '#fff', fontSize: 10 }]}>Home</Text>
              <Text style={[styles.storeLogoText, { color: '#fff', fontSize: 10 }]}>Delight</Text>
            </View>
            <Text style={styles.storeName}>Home Delight</Text>
            <Text style={styles.storeCategory}>Home & Kitchen</Text>
            <View style={styles.storeRating}>
              <Star size={12} color="#22c55e" fill="#22c55e" />
              <Text style={styles.storeRatingScore}>4.6 <Text style={styles.storeRatingCount}>(1.1K)</Text></Text>
            </View>
          </View>

          {/* Store 4 */}
          <View style={styles.storeCard}>
            <TouchableOpacity style={styles.storeHeartBtn}>
              <Heart size={14} color="#2563eb" />
            </TouchableOpacity>
            <View style={[styles.storeLogo, { backgroundColor: '#fce7f3' }]}>
              <Text style={[styles.storeLogoText, { color: '#be185d' }]}>Beauty</Text>
              <Text style={[styles.storeLogoText, { color: '#be185d' }]}>Glow</Text>
            </View>
            <Text style={styles.storeName}>Beauty Glow</Text>
            <Text style={styles.storeCategory}>Beauty & Personal Care</Text>
            <View style={styles.storeRating}>
              <Star size={12} color="#22c55e" fill="#22c55e" />
              <Text style={styles.storeRatingScore}>4.2 <Text style={styles.storeRatingCount}>(732)</Text></Text>
            </View>
          </View>
        </ScrollView>

        {/* Menu List */}
        <View style={styles.menuListCard}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === menuItems.length - 1;
            return (
              <TouchableOpacity 
                key={item.label} 
                style={[styles.menuListItem, isLast && styles.menuListItemLast, item.isLogout && styles.logoutItem]}
                onPress={() => item.href ? router.push(item.href as any) : null}
              >
                <View style={[styles.menuListIconWrap, { backgroundColor: item.isLogout ? '#fee2e2' : '#f1f5f9' }]}>
                  <Icon size={20} color={item.iconColor || '#3b82f6'} />
                </View>
                <View style={styles.menuListTextWrap}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.menuListLabel, item.isLogout && {color: '#ef4444'}]}>{item.label}</Text>
                    {item.isPromo && (
                      <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>New</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.menuListSubLabel}>{item.subLabel}</Text>
                </View>
                <ChevronRight size={20} color="#0f172a" />
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
    marginRight: 4,
  },
  logoIconLayer: {
    width: 14,
    height: 24,
    borderRadius: 6,
    position: 'absolute',
    transform: [{ skewX: '-15deg' }],
  },
  logoText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoSubtext: {
    color: '#cbd5e1',
    fontSize: 9,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#3b82f6',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#081028',
  },
  badgeRed: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#081028',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  locationProfileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    gap: 6,
    flex: 1,
    marginRight: 16,
  },
  locationText: {
    color: '#ffffff',
    fontSize: 11,
    flex: 1,
  },
  profileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  scrollContent: {
    padding: 16,
  },
  pageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  profileContact: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 2,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  editProfileText: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionLink: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
  },
  ordersStatsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    width: '23%',
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 2,
  },
  actionCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  actionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionCardText: {
    flex: 1,
  },
  actionCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  actionCardSubtitle: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  storesScroll: {
    paddingBottom: 24,
    gap: 12,
  },
  storeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: 140,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    marginRight: 12,
  },
  storeHeartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  storeLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 8,
  },
  storeLogoText: {
    fontWeight: '800',
    fontSize: 12,
  },
  storeName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
  },
  storeCategory: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeRatingScore: {
    fontSize: 10,
    fontWeight: '700',
    color: '#22c55e',
  },
  storeRatingCount: {
    color: '#64748b',
    fontWeight: '400',
  },
  menuListCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuListItemLast: {
    borderBottomWidth: 0,
  },
  logoutItem: {
    backgroundColor: '#fff',
  },
  menuListIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuListTextWrap: {
    flex: 1,
  },
  menuListLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  menuListSubLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  newBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
});
