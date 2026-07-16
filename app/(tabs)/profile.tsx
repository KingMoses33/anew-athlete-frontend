import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { useAuth } from "@/contexts/AuthContext";

type MenuItemProps = {
  icon: string;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function MenuItem({ icon, label, onPress, danger = false }: MenuItemProps) {
  const colors = useColors();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.menuItem,
        { borderBottomColor: colors.border, opacity: pressed ? 0.7 : 1 },
      ]}
      onPress={onPress}
    >
      <View style={styles.menuLeft}>
        <Ionicons
          name={icon as any}
          size={20}
          color={danger ? colors.destructive : colors.primary}
        />
        <Text
          style={[
            styles.menuLabel,
            { color: danger ? colors.destructive : colors.foreground },
          ]}
        >
          {label}
        </Text>
      </View>
      {!danger && (
        <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, isLoggedIn, logout } = useAuth();

  const webTop = Platform.OS === "web" ? 67 : 0;
  const bottomPad = insets.bottom + (Platform.OS === "web" ? 34 : 0);

  function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/");
        },
      },
    ]);
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
        <View style={[styles.guestAvatar, { backgroundColor: colors.muted }]}>
          <Ionicons name="person-outline" size={40} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.guestTitle, { color: colors.foreground }]}>Your Profile</Text>
        <Text style={[styles.guestText, { color: colors.mutedForeground }]}>
          Log in to view your profile, manage settings, and track your sessions.
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
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Pressable onPress={() => router.push("/apply")}>
          <Text style={[styles.applyLink, { color: colors.primary }]}>Apply to Coach</Text>
        </Pressable>
      </View>
    );
  }

  const initials = user!.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + webTop + 20,
          paddingBottom: bottomPad + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>{initials}</Text>
        </View>
        <Text style={[styles.userName, { color: colors.foreground }]}>{user!.name}</Text>
        <Text style={[styles.userEmail, { color: colors.mutedForeground }]}>{user!.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.roleText, { color: colors.primary }]}>
            {user!.role === "coach" ? "Coach" : "Athlete"}
          </Text>
        </View>
      </View>

      {user!.role === "coach" && (
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            COACH DASHBOARD
          </Text>
          <MenuItem icon="people-outline" label="My Athletes" onPress={() => {}} />
          <MenuItem icon="calendar-outline" label="My Schedule" onPress={() => {}} />
          <MenuItem icon="cash-outline" label="Earnings" onPress={() => {}} />
        </View>
      )}

      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>ACCOUNT</Text>
        <MenuItem icon="person-outline" label="Edit Profile" onPress={() => {}} />
        <MenuItem
          icon="location-outline"
          label={user!.location || "Set Your Location"}
          onPress={() => {}}
        />
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
      </View>

      <View style={[styles.section, { borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>SUPPORT</Text>
        <MenuItem icon="help-circle-outline" label="Help & FAQ" onPress={() => {}} />
        <MenuItem icon="mail-outline" label="Contact Us" onPress={() => {}} />
        <MenuItem icon="document-text-outline" label="Privacy Policy" onPress={() => {}} />
      </View>

      <View style={[styles.section, { borderColor: colors.border }]}>
        <MenuItem
          icon="log-out-outline"
          label="Log Out"
          onPress={handleLogout}
          danger
        />
      </View>
    </ScrollView>
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
  guestAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  guestTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
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
  divider: {
    width: "80%",
    height: 1,
    marginVertical: 8,
  },
  applyLink: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  container: {
    paddingHorizontal: 16,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 6,
    marginBottom: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 30,
    fontFamily: "Inter_700Bold",
  },
  userName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  roleText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  section: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
});
