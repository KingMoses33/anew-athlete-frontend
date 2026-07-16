import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColors } from "@/hooks/useColors";
import { COACHES } from "@/constants/coaches";
import StarRating from "@/components/StarRating";
import { useAuth, bookingsKey } from "@/contexts/AuthContext";
import { type Booking } from "@/app/(tabs)/bookings";

type PackageOption = {
  id: string;
  label: string;
  sessions: number;
  discountPct: number;
  badge?: string;
  description: string;
};

const PACKAGES: PackageOption[] = [
  {
    id: "trial",
    label: "Beginner Trial",
    sessions: 1,
    discountPct: 25,
    badge: "25% OFF",
    description: "Perfect for first-timers. Try a session at a reduced rate.",
  },
  {
    id: "pack4",
    label: "4-Session Pack",
    sessions: 4,
    discountPct: 10,
    badge: "SAVE 10%",
    description: "Commit to consistent progress with 4 sessions.",
  },
  {
    id: "pack8",
    label: "8-Session Pack",
    sessions: 8,
    discountPct: 20,
    badge: "BEST VALUE",
    description: "Maximum value. Ideal for serious athletes.",
  },
];

function packagePrice(pricePerHour: number, pkg: PackageOption): number {
  return Math.round(pricePerHour * pkg.sessions * (1 - pkg.discountPct / 100));
}

function perSessionPrice(pricePerHour: number, pkg: PackageOption): number {
  return Math.round(pricePerHour * (1 - pkg.discountPct / 100));
}

export default function CoachProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, user } = useAuth();

  const [bookingModal, setBookingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageOption | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const coach = COACHES.find((c) => c.id === id);

  if (!coach) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.foreground }]}>Coach not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[styles.backLink, { color: colors.primary }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  function openBookingModal(pkg?: PackageOption) {
    if (!isLoggedIn) {
      Alert.alert("Login Required", "Please log in to book a session.", [
        { text: "Cancel", style: "cancel" },
        { text: "Log In", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }
    if (pkg) setSelectedPackage(pkg);
    setSelectedDay(null);
    setSelectedTime(null);
    setBookingModal(true);
  }

  async function handleBook() {
    if (!selectedDay || !selectedTime) {
      Alert.alert("Select a Time", "Please pick a day and time for your session.");
      return;
    }

    const pkg = selectedPackage;
    const price = pkg ? packagePrice(coach.pricePerHour, pkg) : coach.pricePerHour;
    const label = pkg ? pkg.label : "Single Session";

    const newBooking: Booking = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 7),
      coachName: coach.name,
      coachSport: coach.sport,
      coachAvatar: coach.avatar,
      date: selectedDay,
      time: selectedTime,
      status: "upcoming",
      price,
    };

    if (!user) return;
    const key = bookingsKey(user.id);
    const existing = await AsyncStorage.getItem(key);
    const list: Booking[] = existing ? JSON.parse(existing) : [];
    list.unshift(newBooking);
    await AsyncStorage.setItem(key, JSON.stringify(list));

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setBookingModal(false);
    Alert.alert(
      "Booking Confirmed! 🎉",
      `${label} with ${coach.name} confirmed for ${selectedDay} at ${selectedTime}.`,
      [
        { text: "View Bookings", onPress: () => router.push("/(tabs)/bookings") },
        { text: "OK", style: "cancel" },
      ]
    );
  }

  const webTop = Platform.OS === "web" ? 67 : 0;
  const activePackage = selectedPackage;

  return (
    <>
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + webTop,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={[styles.heroAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.heroAvatarText, { color: colors.primaryForeground }]}>
              {coach.avatar}
            </Text>
          </View>
          <Text style={[styles.coachName, { color: colors.foreground }]}>{coach.name}</Text>
          <Text style={[styles.coachSport, { color: colors.primary }]}>{coach.sport}</Text>
          <View style={styles.metaRow}>
            <StarRating rating={coach.rating} reviewCount={coach.reviewCount} size={15} />
            <Text style={[styles.dot, { color: colors.mutedForeground }]}>·</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {coach.location} · {coach.distance} mi
              </Text>
            </View>
            <Text style={[styles.dot, { color: colors.mutedForeground }]}>·</Text>
            <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
              {coach.yearsExperience} yrs exp
            </Text>
          </View>
        </View>

        {/* Rate */}
        <View style={[styles.priceCard, { backgroundColor: colors.primaryLight, borderColor: colors.primary + "30" }]}>
          <Text style={[styles.priceAmount, { color: colors.primary }]}>${coach.pricePerHour}</Text>
          <Text style={[styles.priceLabel, { color: colors.primary }]}>/session</Text>
        </View>

        {/* Packages */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Packages & Pricing</Text>

          {PACKAGES.map((pkg) => {
            const total = packagePrice(coach.pricePerHour, pkg);
            const perSession = perSessionPrice(coach.pricePerHour, pkg);
            const isTrial = pkg.id === "trial";

            return (
              <View
                key={pkg.id}
                style={[
                  styles.packageCard,
                  {
                    borderColor: isTrial ? colors.primary : colors.border,
                    backgroundColor: isTrial ? colors.primaryLight : colors.card,
                  },
                ]}
              >
                <View style={styles.packageTop}>
                  <View style={styles.packageInfo}>
                    <View style={styles.packageLabelRow}>
                      <Text style={[styles.packageLabel, { color: colors.foreground }]}>
                        {pkg.label}
                      </Text>
                      {pkg.badge && (
                        <View
                          style={[
                            styles.packageBadge,
                            { backgroundColor: isTrial ? colors.primary : colors.foreground },
                          ]}
                        >
                          <Text style={[styles.packageBadgeText, { color: colors.primaryForeground }]}>
                            {pkg.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.packageDesc, { color: colors.mutedForeground }]}>
                      {pkg.description}
                    </Text>
                  </View>

                  <View style={styles.packagePricing}>
                    <View style={styles.packageOrigRow}>
                      <Text style={[styles.packageOrigPrice, { color: colors.mutedForeground }]}>
                        ${coach.pricePerHour * pkg.sessions}
                      </Text>
                    </View>
                    <Text style={[styles.packageTotal, { color: colors.primary }]}>${total}</Text>
                    {pkg.sessions > 1 && (
                      <Text style={[styles.packagePerSession, { color: colors.mutedForeground }]}>
                        ${perSession}/session
                      </Text>
                    )}
                  </View>
                </View>

                <Pressable
                  style={[
                    styles.packageBookBtn,
                    { backgroundColor: isTrial ? colors.primary : colors.foreground },
                  ]}
                  onPress={() => openBookingModal(pkg)}
                >
                  <Ionicons name="calendar-outline" size={15} color={colors.primaryForeground} />
                  <Text style={[styles.packageBookBtnText, { color: colors.primaryForeground }]}>
                    Book {pkg.label}
                  </Text>
                </Pressable>
              </View>
            );
          })}
        </View>

        {/* About */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About</Text>
          <Text style={[styles.bio, { color: colors.foreground }]}>{coach.bio}</Text>
        </View>

        {/* Credentials */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Credentials</Text>
          {coach.credentials.map((cred, i) => (
            <View key={i} style={styles.credRow}>
              <Ionicons name="shield-checkmark" size={16} color={colors.primary} />
              <Text style={[styles.credText, { color: colors.foreground }]}>{cred}</Text>
            </View>
          ))}
        </View>

        {/* Specialties */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Specialties</Text>
          <View style={styles.tagsWrap}>
            {coach.specialties.map((s, i) => (
              <View key={i} style={[styles.tag, { backgroundColor: colors.muted }]}>
                <Text style={[styles.tagText, { color: colors.foreground }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Reviews</Text>
          {coach.reviews.map((review) => (
            <View
              key={review.id}
              style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.reviewHeader}>
                <Text style={[styles.reviewAuthor, { color: colors.foreground }]}>
                  {review.author}
                </Text>
                <Text style={[styles.reviewDate, { color: colors.mutedForeground }]}>
                  {review.date}
                </Text>
              </View>
              <StarRating rating={review.rating} size={13} />
              <Text style={[styles.reviewText, { color: colors.foreground }]}>{review.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky bottom bar */}
      <View
        style={[
          styles.bookBar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 8,
          },
        ]}
      >
        <Pressable
          style={[styles.bookBtn, { backgroundColor: colors.primary }]}
          onPress={() => openBookingModal()}
          testID="book-session-button"
        >
          <Ionicons name="calendar-outline" size={18} color={colors.primaryForeground} />
          <Text style={[styles.bookBtnText, { color: colors.primaryForeground }]}>
            Book a Session
          </Text>
        </Pressable>
      </View>

      {/* Booking modal */}
      <Modal visible={bookingModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Book a Session</Text>
            <Pressable onPress={() => setBookingModal(false)} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent}>
            <Text style={[styles.modalCoachName, { color: colors.foreground }]}>
              with {coach.name}
            </Text>
            <Text style={[styles.modalSport, { color: colors.primary }]}>{coach.sport}</Text>

            {/* Package selector in modal */}
            <Text style={[styles.modalSectionLabel, { color: colors.mutedForeground }]}>
              SELECT PACKAGE
            </Text>
            <View style={styles.modalPackageList}>
              {PACKAGES.map((pkg) => {
                const total = packagePrice(coach.pricePerHour, pkg);
                const isSelected = activePackage?.id === pkg.id;
                return (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[
                      styles.modalPackageOption,
                      {
                        borderColor: isSelected ? colors.primary : colors.border,
                        backgroundColor: isSelected ? colors.primaryLight : colors.background,
                      },
                    ]}
                    onPress={() => setSelectedPackage(pkg)}
                  >
                    <View style={styles.modalPackageLeft}>
                      <View
                        style={[
                          styles.modalRadio,
                          {
                            borderColor: isSelected ? colors.primary : colors.border,
                            backgroundColor: isSelected ? colors.primary : "transparent",
                          },
                        ]}
                      />
                      <View>
                        <Text
                          style={[
                            styles.modalPackageLabel,
                            { color: isSelected ? colors.primary : colors.foreground },
                          ]}
                        >
                          {pkg.label}
                        </Text>
                        <Text style={[styles.modalPackageSessions, { color: colors.mutedForeground }]}>
                          {pkg.sessions} session{pkg.sessions > 1 ? "s" : ""} · {pkg.discountPct}% off
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.modalPackagePrice, { color: isSelected ? colors.primary : colors.foreground }]}>
                      ${total}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Availability */}
            <Text style={[styles.modalSectionLabel, { color: colors.mutedForeground }]}>
              SELECT START DATE & TIME
            </Text>
            {coach.availability.map((avail) => (
              <View key={avail.day} style={styles.availDay}>
                <Pressable
                  style={[
                    styles.dayBtn,
                    {
                      backgroundColor: selectedDay === avail.day ? colors.primary : colors.muted,
                      borderColor: selectedDay === avail.day ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => {
                    setSelectedDay(avail.day);
                    setSelectedTime(null);
                  }}
                >
                  <Text
                    style={[
                      styles.dayBtnText,
                      { color: selectedDay === avail.day ? colors.primaryForeground : colors.foreground },
                    ]}
                  >
                    {avail.day}
                  </Text>
                </Pressable>

                {selectedDay === avail.day && (
                  <View style={styles.timesRow}>
                    {avail.times.map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.timeChip,
                          {
                            backgroundColor: selectedTime === t ? colors.primary : colors.muted,
                            borderColor: selectedTime === t ? colors.primary : colors.border,
                          },
                        ]}
                        onPress={() => setSelectedTime(t)}
                      >
                        <Text
                          style={[
                            styles.timeChipText,
                            { color: selectedTime === t ? colors.primaryForeground : colors.foreground },
                          ]}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}

            {/* Order summary */}
            {activePackage && selectedDay && selectedTime && (
              <View style={[styles.summary, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                <Text style={[styles.summaryTitle, { color: colors.foreground }]}>Order Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Package</Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>{activePackage.label}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Sessions</Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>{activePackage.sessions}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Start</Text>
                  <Text style={[styles.summaryValue, { color: colors.foreground }]}>{selectedDay} · {selectedTime}</Text>
                </View>
                <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryTotal, { color: colors.foreground }]}>Total</Text>
                  <Text style={[styles.summaryTotalValue, { color: colors.primary }]}>
                    ${packagePrice(coach.pricePerHour, activePackage)}
                  </Text>
                </View>
              </View>
            )}

            <Pressable
              style={[
                styles.confirmBtn,
                {
                  backgroundColor:
                    activePackage && selectedDay && selectedTime ? colors.primary : colors.muted,
                },
              ]}
              onPress={handleBook}
              disabled={!activePackage || !selectedDay || !selectedTime}
            >
              <Text
                style={[
                  styles.confirmBtnText,
                  {
                    color:
                      activePackage && selectedDay && selectedTime
                        ? colors.primaryForeground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {activePackage && selectedDay && selectedTime
                  ? `Confirm — $${packagePrice(coach.pricePerHour, activePackage)}`
                  : "Select a package and time"}
              </Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20 },
  errorContainer: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorText: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  backLink: { fontSize: 15, fontFamily: "Inter_500Medium" },
  backBtn: { paddingTop: 12, paddingBottom: 8 },
  heroSection: { alignItems: "center", paddingVertical: 20, gap: 6 },
  heroAvatar: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  heroAvatarText: { fontSize: 32, fontFamily: "Inter_700Bold" },
  coachName: { fontSize: 26, fontFamily: "Inter_700Bold" },
  coachSport: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  metaRow: {
    flexDirection: "row", alignItems: "center", gap: 6,
    flexWrap: "wrap", justifyContent: "center", marginTop: 4,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  dot: { fontSize: 13 },
  priceCard: {
    flexDirection: "row", alignItems: "baseline", justifyContent: "center",
    gap: 2, borderWidth: 1, borderRadius: 12, paddingVertical: 16, marginBottom: 8,
  },
  priceAmount: { fontSize: 32, fontFamily: "Inter_700Bold" },
  priceLabel: { fontSize: 16, fontFamily: "Inter_500Medium" },

  // Packages
  section: { borderTopWidth: 1, paddingTop: 20, paddingBottom: 4, marginBottom: 8, gap: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 4 },
  packageCard: {
    borderRadius: 12, borderWidth: 1.5, padding: 16, gap: 12,
  },
  packageTop: { flexDirection: "row", gap: 12 },
  packageInfo: { flex: 1, gap: 4 },
  packageLabelRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  packageLabel: { fontSize: 15, fontFamily: "Inter_700Bold" },
  packageBadge: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20,
  },
  packageBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  packageDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  packagePricing: { alignItems: "flex-end", gap: 2 },
  packageOrigRow: {},
  packageOrigPrice: {
    fontSize: 12, fontFamily: "Inter_400Regular", textDecorationLine: "line-through",
  },
  packageTotal: { fontSize: 22, fontFamily: "Inter_700Bold" },
  packagePerSession: { fontSize: 11, fontFamily: "Inter_400Regular" },
  packageBookBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, height: 42, borderRadius: 10,
  },
  packageBookBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  // About / credentials / specialties / reviews
  bio: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 23 },
  credRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  credText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  reviewCard: { borderRadius: 10, borderWidth: 1, padding: 14, gap: 6, marginBottom: 10 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reviewAuthor: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  reviewDate: { fontSize: 12, fontFamily: "Inter_400Regular" },
  reviewText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },

  // Bottom bar
  bookBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 20, paddingTop: 12, borderTopWidth: 1,
  },
  bookBtn: {
    height: 52, borderRadius: 12, alignItems: "center",
    justifyContent: "center", flexDirection: "row", gap: 8,
  },
  bookBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },

  // Modal
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold" },
  modalContent: { padding: 20, gap: 14 },
  modalCoachName: { fontSize: 20, fontFamily: "Inter_700Bold" },
  modalSport: { fontSize: 14, fontFamily: "Inter_500Medium", marginTop: -6 },
  modalSectionLabel: {
    fontSize: 11, fontFamily: "Inter_600SemiBold",
    letterSpacing: 1, textTransform: "uppercase", marginTop: 4,
  },
  modalPackageList: { gap: 10 },
  modalPackageOption: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    borderWidth: 1.5, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12,
  },
  modalPackageLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalRadio: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2,
  },
  modalPackageLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  modalPackageSessions: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  modalPackagePrice: { fontSize: 16, fontFamily: "Inter_700Bold" },
  availDay: { gap: 10 },
  dayBtn: {
    paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, alignSelf: "flex-start",
  },
  dayBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  timesRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingLeft: 8 },
  timeChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  timeChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },

  // Summary
  summary: {
    borderRadius: 12, borderWidth: 1, padding: 16, gap: 8,
  },
  summaryTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 4 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  summaryValue: { fontSize: 13, fontFamily: "Inter_500Medium" },
  summaryDivider: { height: 1, marginVertical: 4 },
  summaryTotal: { fontSize: 15, fontFamily: "Inter_700Bold" },
  summaryTotalValue: { fontSize: 16, fontFamily: "Inter_700Bold" },

  confirmBtn: {
    height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 4,
  },
  confirmBtnText: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
