import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  rating: number;
  reviewCount?: number;
  size?: number;
};

export default function StarRating({ rating, reviewCount, size = 14 }: Props) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      <Ionicons name="star" size={size} color={colors.star} />
      <Text style={[styles.rating, { fontSize: size, color: colors.foreground }]}>
        {rating.toFixed(1)}
      </Text>
      {reviewCount !== undefined && (
        <Text style={[styles.count, { fontSize: size - 1, color: colors.mutedForeground }]}>
          ({reviewCount})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  rating: {
    fontFamily: "Inter_600SemiBold",
  },
  count: {
    fontFamily: "Inter_400Regular",
  },
});
