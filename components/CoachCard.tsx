import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { type Coach } from "@/constants/coaches";
import StarRating from "./StarRating";

type Props = {
  coach: Coach;
};

export default function CoachCard({ coach }: Props) {
  const colors = useColors();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
      onPress={() => router.push(`/coach/${coach.id}`)}
      testID={`coach-card-${coach.id}`}
    >
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
            {coach.avatar}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.foreground }]}>{coach.name}</Text>
          <Text style={[styles.sport, { color: colors.primary }]}>{coach.sport}</Text>
          <View style={styles.meta}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color={colors.mutedForeground} />
              <Text style={[styles.location, { color: colors.mutedForeground }]}>
                {coach.location} · {coach.distance} mi
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.priceCol}>
          <Text style={[styles.price, { color: colors.primary }]}>${coach.pricePerHour}</Text>
          <Text style={[styles.priceLabel, { color: colors.mutedForeground }]}>/hr</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.footer}>
        <StarRating rating={coach.rating} reviewCount={coach.reviewCount} />
        <View style={styles.expBadge}>
          <Text style={[styles.expText, { color: colors.mutedForeground }]}>
            {coach.yearsExperience} yrs exp
          </Text>
        </View>
        <View style={[styles.viewBtn, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.viewBtnText, { color: colors.primary }]}>View Profile</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  sport: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  meta: {
    marginTop: 2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  location: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  priceCol: {
    alignItems: "flex-end",
  },
  price: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expBadge: {
    flex: 1,
  },
  expText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  viewBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
