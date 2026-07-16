import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useSearch } from "@/contexts/SearchContext";
import { COACHES } from "@/constants/coaches";
import { SPORTS } from "@/constants/sports";
import CoachCard from "@/components/CoachCard";
import SportPicker from "@/components/SportPicker";

const DISTANCES = [10, 25, 50, 100];

export default function ExploreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { sport, location, maxDistance, setFilters } = useSearch();

  const [localSport, setLocalSport] = useState(sport);
  const [localLocation, setLocalLocation] = useState(location);
  const [localDistance, setLocalDistance] = useState(maxDistance);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return COACHES.filter((c) => {
      const sportMatch = !localSport || c.sportId === localSport;
      const distMatch = c.distance <= localDistance;
      return sportMatch && distMatch;
    });
  }, [localSport, localLocation, localDistance]);

  function applyFilters() {
    setFilters(localSport, localLocation, localDistance);
    setShowFilters(false);
  }

  const webTop = Platform.OS === "web" ? 67 : 0;
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + webTop,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.push("/")} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Find Coaches</Text>
          <Pressable
            style={[
              styles.filterBtn,
              {
                backgroundColor: showFilters ? colors.primaryLight : colors.muted,
                borderColor: showFilters ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setShowFilters((v) => !v)}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={showFilters ? colors.primary : colors.mutedForeground}
            />
            <Text
              style={[
                styles.filterBtnText,
                { color: showFilters ? colors.primary : colors.mutedForeground },
              ]}
            >
              Filters
            </Text>
          </Pressable>
        </View>

        <View style={[styles.searchRow, { borderColor: colors.border }]}>
          <Ionicons name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Enter a city or zip"
            placeholderTextColor={colors.mutedForeground}
            value={localLocation}
            onChangeText={setLocalLocation}
            returnKeyType="search"
            onSubmitEditing={applyFilters}
          />
        </View>

        {showFilters && (
          <View style={styles.filtersPanel}>
            <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>
              Sport / Skill
            </Text>
            <SportPicker value={localSport} onChange={setLocalSport} />

            <Text style={[styles.filterLabel, { color: colors.mutedForeground }]}>
              Max Distance
            </Text>
            <View style={styles.distanceRow}>
              {DISTANCES.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[
                    styles.distChip,
                    {
                      backgroundColor:
                        localDistance === d ? colors.primary : colors.muted,
                      borderColor:
                        localDistance === d ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setLocalDistance(d)}
                >
                  <Text
                    style={[
                      styles.distChipText,
                      {
                        color:
                          localDistance === d
                            ? colors.primaryForeground
                            : colors.mutedForeground,
                      },
                    ]}
                  >
                    {d} mi
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Pressable
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={applyFilters}
            >
              <Text style={[styles.applyBtnText, { color: colors.primaryForeground }]}>
                Search Coaches
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CoachCard coach={item} />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 100 },
        ]}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No coaches found
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Try adjusting your filters or expanding your distance.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <Text style={[styles.resultsCount, { color: colors.mutedForeground }]}>
            {filtered.length} coach{filtered.length !== 1 ? "es" : ""} found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  filtersPanel: {
    gap: 10,
    paddingTop: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  distanceRow: {
    flexDirection: "row",
    gap: 8,
  },
  distChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  distChipText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  applyBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  applyBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  resultsCount: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    marginBottom: 8,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
