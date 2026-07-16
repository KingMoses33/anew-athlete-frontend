import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

import { useColors } from "@/hooks/useColors";

type Provider = "google" | "facebook" | "apple";

type Props = {
  onSocialLogin: (provider: Provider) => Promise<void>;
};

const PROVIDERS: { id: Provider; label: string; bg: string; fg: string; border?: string }[] = [
  { id: "google", label: "Continue with Google", bg: "#FFFFFF", fg: "#1F1F1F", border: "#DADCE0" },
  { id: "facebook", label: "Continue with Facebook", bg: "#1877F2", fg: "#FFFFFF" },
  { id: "apple", label: "Continue with Apple", bg: "#000000", fg: "#FFFFFF" },
];

function GoogleIcon() {
  return (
    <View style={styles.iconBox}>
      <Text style={styles.googleG}>G</Text>
    </View>
  );
}

function FacebookIcon() {
  return (
    <View style={styles.iconBox}>
      <Text style={[styles.socialIconText, { color: "#FFFFFF" }]}>f</Text>
    </View>
  );
}

function AppleIcon({ color }: { color: string }) {
  return (
    <View style={styles.iconBox}>
      <Text style={[styles.appleIcon, { color }]}></Text>
    </View>
  );
}

export default function SocialAuthButtons({ onSocialLogin }: Props) {
  const colors = useColors();
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

  async function handlePress(provider: Provider) {
    if (loadingProvider) return;
    setLoadingProvider(provider);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await onSocialLogin(provider);
    } finally {
      setLoadingProvider(null);
    }
  }

  const visibleProviders =
    Platform.OS === "ios"
      ? PROVIDERS
      : PROVIDERS.filter((p) => p.id !== "apple");

  return (
    <View style={styles.container}>
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.mutedForeground }]}>or</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.buttonsCol}>
        {visibleProviders.map((p) => {
          const isLoading = loadingProvider === p.id;
          return (
            <Pressable
              key={p.id}
              style={[
                styles.btn,
                {
                  backgroundColor: p.bg,
                  borderColor: p.border ?? p.bg,
                  borderWidth: p.border ? 1 : 0,
                  opacity: loadingProvider && !isLoading ? 0.5 : 1,
                },
              ]}
              onPress={() => handlePress(p.id)}
              disabled={!!loadingProvider}
            >
              {isLoading ? (
                <ActivityIndicator color={p.fg} size="small" />
              ) : (
                <>
                  {p.id === "google" && <GoogleIcon />}
                  {p.id === "facebook" && <FacebookIcon />}
                  {p.id === "apple" && <AppleIcon color={p.fg} />}
                  <Text style={[styles.btnText, { color: p.fg }]}>{p.label}</Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  buttonsCol: {
    gap: 12,
  },
  btn: {
    height: 52,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  btnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  iconBox: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  googleG: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#4285F4",
  },
  socialIconText: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  appleIcon: {
    fontSize: 20,
    lineHeight: 22,
  },
});
