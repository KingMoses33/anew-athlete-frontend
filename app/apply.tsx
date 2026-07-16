import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
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
import { SPORTS } from "@/constants/sports";
import SportPicker from "@/components/SportPicker";

export default function ApplyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [sport, setSport] = useState("");
  const [city, setCity] = useState("");
  const [bio, setBio] = useState("");
  const [credentials, setCredentials] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!name || !email || !sport || !city || !bio) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  }

  const webTop = Platform.OS === "web" ? 67 : 0;

  if (submitted) {
    return (
      <View
        style={[
          styles.successContainer,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + webTop,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0),
          },
        ]}
      >
        <View style={[styles.successIcon, { backgroundColor: colors.primaryLight }]}>
          <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
        </View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>
          Application Submitted!
        </Text>
        <Text style={[styles.successText, { color: colors.mutedForeground }]}>
          Thank you for applying to coach on Anew Athlete. Our team will review your application
          and get back to you within 3-5 business days.
        </Text>
        <Pressable
          style={[styles.doneBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.replace("/(tabs)/explore")}
        >
          <Text style={[styles.doneBtnText, { color: colors.primaryForeground }]}>
            Browse Coaches
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + webTop + 12,
            paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 0) + 40,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>Apply to Coach</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Join our network of verified coaches and connect with athletes in your area.
        </Text>

        <View style={styles.form}>
          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>Full Name *</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Your full name"
                placeholderTextColor={colors.mutedForeground}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>Email *</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="your@email.com"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>Phone</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="(555) 000-0000"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>Primary Sport *</Text>
            <SportPicker value={sport} onChange={setSport} />
          </View>

          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>City & State *</Text>
            <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="e.g. Austin, TX"
                placeholderTextColor={colors.mutedForeground}
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>
              Credentials & Experience
            </Text>
            <View style={[styles.inputWrapper, styles.textArea, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, styles.textAreaInput, { color: colors.foreground }]}
                placeholder="e.g. USSF B License, NCAA D1 player, 5 years coaching youth soccer..."
                placeholderTextColor={colors.mutedForeground}
                value={credentials}
                onChangeText={setCredentials}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>Bio *</Text>
            <View style={[styles.inputWrapper, styles.textArea, { borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, styles.textAreaInput, { color: colors.foreground }]}
                placeholder="Tell athletes about yourself, your coaching philosophy, and what makes you unique..."
                placeholderTextColor={colors.mutedForeground}
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>
          </View>

          <Pressable
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            onPress={handleSubmit}
            testID="apply-submit-button"
          >
            <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>
              Submit Application
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  successText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 22,
  },
  doneBtn: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
  },
  doneBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  container: {
    paddingHorizontal: 20,
  },
  headerRow: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    marginBottom: 28,
  },
  form: {
    gap: 18,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 6,
  },
  inputWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  textArea: {
    paddingVertical: 12,
  },
  textAreaInput: {
    minHeight: 80,
  },
  submitBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
});
