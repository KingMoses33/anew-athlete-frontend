import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useSearch } from "@/contexts/SearchContext";
import { SPORTS } from "@/constants/sports";
import SportPicker from "@/components/SportPicker";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setFilters } = useSearch();

  const [selectedSport, setSelectedSport] = useState("");
  const [locationInput, setLocationInput] = useState("");

  function handleFind() {
    setFilters(selectedSport, locationInput);
    router.push("/(tabs)/explore");
  }

  const webTop = Platform.OS === "web" ? 67 : 0;

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + webTop + 24,
          paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 40,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.navRow}>
        <View>
          <Text style={[styles.appName, { color: colors.primary }]}>Anew Athlete</Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Find a coach. Reach new Heights.
          </Text>
        </View>
        <View style={styles.navActions}>
          <Pressable
            style={[styles.navBtn, { borderColor: colors.border }]}
            onPress={() => router.push("/(auth)/login")}
          >
            <Text style={[styles.navBtnText, { color: colors.foreground }]}>Login</Text>
          </Pressable>
          <Pressable
            style={[styles.navSignup, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(auth)/signup")}
          >
            <Text style={[styles.navSignupText, { color: colors.primaryForeground }]}>Sign Up</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.promoChip, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name="flame" size={14} color={colors.primary} />
        <Text style={[styles.promoText, { color: colors.primary }]}>
          First lesson 25% off —{" "}
          <Text style={styles.promoLink}>Learn More</Text>
        </Text>
      </View>

      <Text style={[styles.hero, { color: colors.foreground }]}>
        Find a coach.{"\n"}Reach new Heights.
      </Text>

      <View style={styles.searchCard}>
        <SportPicker value={selectedSport} onChange={setSelectedSport} />

        <View style={[styles.locationInput, { borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.locationText, { color: colors.foreground }]}
            placeholder="Enter a city or zip"
            placeholderTextColor={colors.mutedForeground}
            value={locationInput}
            onChangeText={setLocationInput}
            returnKeyType="search"
            onSubmitEditing={handleFind}
          />
        </View>

        <Pressable
          style={[styles.findBtn, { backgroundColor: colors.primary }]}
          onPress={handleFind}
          testID="find-coaches-button"
        >
          <Text style={[styles.findBtnText, { color: colors.primaryForeground }]}>
            Find Coaches
          </Text>
        </Pressable>
      </View>

      <View style={styles.sportsSection}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sports we serve</Text>
        <View style={styles.sportsGrid}>
          {SPORTS.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[styles.sportChip, { borderColor: colors.border, backgroundColor: colors.background }]}
              onPress={() => {
                setSelectedSport(sport.id);
                setFilters(sport.id, locationInput);
                router.push("/(tabs)/explore");
              }}
            >
              <Text style={styles.sportEmoji}>{sport.icon}</Text>
              <Text style={[styles.sportName, { color: colors.foreground }]}>{sport.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.applyBanner}>
        <View style={[styles.applyCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.applyTitle, { color: colors.primaryForeground }]}>
            Are you a coach?
          </Text>
          <Text style={[styles.applySubtitle, { color: "rgba(255,255,255,0.8)" }]}>
            Join our platform and connect with athletes in your area.
          </Text>
          <Pressable
            style={[styles.applyBtn, { backgroundColor: colors.primaryForeground }]}
            onPress={() => router.push("/apply")}
          >
            <Text style={[styles.applyBtnText, { color: colors.primary }]}>Apply to Coach</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 10,
  },
  backBtn: {
    paddingRight: 4,
  },
  appName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  tagline: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
  },
  navActions: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  navBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  navBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  navSignup: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  navSignupText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  promoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  promoText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  promoLink: {
    fontFamily: "Inter_600SemiBold",
    textDecorationLine: "underline",
  },
  hero: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    lineHeight: 40,
    marginBottom: 28,
    textAlign: "center",
  },
  searchCard: {
    gap: 12,
    marginBottom: 36,
  },
  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  findBtn: {
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  findBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  sportsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 16,
  },
  sportsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  sportChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: "45%",
    flex: 0,
  },
  sportEmoji: {
    fontSize: 16,
  },
  sportName: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  applyBanner: {
    marginBottom: 20,
  },
  applyCard: {
    borderRadius: 16,
    padding: 24,
    gap: 8,
  },
  applyTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  applySubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  applyBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  applyBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
