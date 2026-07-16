import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
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
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import SocialAuthButtons from "@/components/SocialAuthButtons";

export default function SignupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signup, socialLogin } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("athlete");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) {
      Alert.alert("Missing Fields", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    const success = await signup(name, email, password, role);
    setLoading(false);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/explore");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Signup Failed", "Please check your information and try again.");
    }
  }

  async function handleSocialLogin(provider: "google" | "facebook" | "apple") {
    const success = await socialLogin(provider);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace("/(tabs)/explore");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Sign Up Failed", `Could not sign up with ${provider}. Please try again.`);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>

        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Join Anew Athlete today
          </Text>
        </View>

        <SocialAuthButtons onSocialLogin={handleSocialLogin} />

        <View style={[styles.dividerRow, { marginTop: 16 }]}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>
            or sign up with email
          </Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.foreground }]}>I am an...</Text>
        <View style={styles.roleRow}>
          {(["athlete", "coach"] as UserRole[]).map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleBtn,
                {
                  borderColor: role === r ? colors.primary : colors.border,
                  backgroundColor: role === r ? colors.primaryLight : colors.background,
                },
              ]}
              onPress={() => setRole(r)}
              testID={`role-${r}`}
            >
              <Ionicons
                name={r === "athlete" ? "fitness-outline" : "whistle-outline" as any}
                size={22}
                color={role === r ? colors.primary : colors.mutedForeground}
              />
              <Text
                style={[
                  styles.roleBtnText,
                  { color: role === r ? colors.primary : colors.mutedForeground },
                ]}
              >
                {r === "athlete" ? "Athlete" : "Coach"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Full Name"
              placeholderTextColor={colors.mutedForeground}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              testID="name-input"
            />
          </View>

          <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Email"
              placeholderTextColor={colors.mutedForeground}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              testID="email-input"
            />
          </View>

          <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
            <TextInput
              style={[styles.input, { color: colors.foreground }]}
              placeholder="Password"
              placeholderTextColor={colors.mutedForeground}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              testID="password-input"
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={18}
                color={colors.mutedForeground}
              />
            </Pressable>
          </View>

          <Pressable
            style={[styles.signupBtn, { backgroundColor: colors.primary }]}
            onPress={handleSignup}
            disabled={loading}
            testID="signup-button"
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={[styles.signupBtnText, { color: colors.primaryForeground }]}>
                Create Account
              </Text>
            )}
          </Pressable>
        </View>

        <View style={styles.loginRow}>
          <Text style={[styles.loginLabel, { color: colors.mutedForeground }]}>
            Already have an Account?{" "}
          </Text>
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>Log In</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backBtn: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  roleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  roleBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  form: {
    gap: 14,
    marginBottom: 32,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  signupBtn: {
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  signupBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginLabel: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  loginLink: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
