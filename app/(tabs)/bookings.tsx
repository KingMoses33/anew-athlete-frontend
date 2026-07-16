import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useColors } from "@/hooks/useColors";
import { useAuth, bookingsKey } from "@/contexts/AuthContext";

export type Booking = {
  id: string;
  coachName: string;
  coachSport: string;
  coachAvatar: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  price: number;
};

export default function BookingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isLoggedIn, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");

  useEffect(() => {
    if (!user) {
      setBookings([]);
      return;
    }
    AsyncStorage.getItem(bookingsKey(user.id)).then((val) => {
      if (val) {
        try {
          setBookings(JSON.parse(val));
        } catch {
          setBookings([]);
        }
      } else {
        setBookings([]);
      }
    });
  }, [user?.id]);

  const filtered = bookings.filter((b) =>
    activeTab === "upcoming"
      ? b.status === "upcoming"
      : b.status === "completed" || b.status === "cancelled"
  );

  const webTop = Platform.OS === "web" ? 67 : 0;
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  function statusColor(status: Booking["status"]) {
    if (status === "upcoming") return colors.primary;
    if (status === "completed") return colors.mutedForeground;
    return colors.destructive;
  }

  if (!isLoggedIn) {
    return (
      <View
        style={[
          styles.guestContainer,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + webTop,
            paddingBottom: bottomPad,
          },
        ]}
      >
        <Ionicons name="calendar-outline" size={64} color={colors.mutedForeground} />
        <Text style={[styles.guestTitle, { color: colors.foreground }]}>Your Bookings</Text>
        <Text style={[styles.guestText, { color: colors.mutedForeground }]}>
          Log in to view and manage your coaching sessions.
        </Text>
        <Pressable
          style={[styles.loginBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={[styles.loginBtnText, { color: colors.primaryForeground }]}>Log In</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/(auth)/signup")}>
          <Text style={[styles.signupLink, { color: colors.primary }]}>Create Account</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + webTop + 12,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>My Bookings</Text>
        <View style={styles.tabRow}>
          {(["upcoming", "completed"] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[
                styles.tab,
                {
                  borderBottomColor:
                    activeTab === tab ? colors.primary : "transparent",
                  borderBottomWidth: 2,
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab ? colors.primary : colors.mutedForeground,
                    fontFamily:
                      activeTab === tab ? "Inter_600SemiBold" : "Inter_400Regular",
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 100 }]}
        scrollEnabled={!!filtered.length}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardRow}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
                  {item.coachAvatar}
                </Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={[styles.coachName, { color: colors.foreground }]}>
                  {item.coachName}
                </Text>
                <Text style={[styles.coachSport, { color: colors.primary }]}>
                  {item.coachSport}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor(item.status) + "20" },
                ]}
              >
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <View style={styles.cardFooter}>
              <View style={styles.footerItem}>
                <Ionicons name="calendar-outline" size={14} color={colors.mutedForeground} />
                <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
                  {item.date}
                </Text>
              </View>
              <View style={styles.footerItem}>
                <Ionicons name="time-outline" size={14} color={colors.mutedForeground} />
                <Text style={[styles.footerText, { color: colors.mutedForeground }]}>
                  {item.time}
                </Text>
              </View>
              <Text style={[styles.price, { color: colors.foreground }]}>${item.price}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No {activeTab} sessions
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {activeTab === "upcoming"
                ? "Browse coaches and book your first session."
                : "Your completed sessions will appear here."}
            </Text>
            {activeTab === "upcoming" && (
              <Pressable
                style={[styles.browseBtn, { backgroundColor: colors.primary }]}
                onPress={() => router.push("/(tabs)/explore")}
              >
                <Text style={[styles.browseBtnText, { color: colors.primaryForeground }]}>
                  Find a Coach
                </Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  guestContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  guestTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    marginTop: 8,
  },
  guestText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  loginBtn: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  loginBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  signupLink: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: "row",
    gap: 24,
  },
  tab: {
    paddingBottom: 12,
  },
  tabText: {
    fontSize: 15,
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  coachName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  coachSport: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  footerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
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
  browseBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
