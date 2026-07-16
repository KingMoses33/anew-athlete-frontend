import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { SPORTS } from "@/constants/sports";

type Props = {
  value: string;
  onChange: (sport: string) => void;
};

export default function SportPicker({ value, onChange }: Props) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  const selected = SPORTS.find((s) => s.id === value);

  return (
    <>
      <Pressable
        style={[styles.trigger, { borderColor: colors.border, backgroundColor: colors.background }]}
        onPress={() => setOpen(true)}
        testID="sport-picker"
      >
        <Text
          style={[
            styles.triggerText,
            { color: selected ? colors.foreground : colors.mutedForeground },
          ]}
        >
          {selected ? selected.name : "Select a sport"}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.mutedForeground} />
      </Pressable>

      <Modal visible={open} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>Select a Sport</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={12}>
              <Ionicons name="close" size={24} color={colors.foreground} />
            </Pressable>
          </View>

          <TouchableOpacity
            style={[styles.option, { borderBottomColor: colors.border }]}
            onPress={() => {
              onChange("");
              setOpen(false);
            }}
          >
            <Text style={[styles.optionText, { color: colors.mutedForeground }]}>
              Any Sport
            </Text>
            {value === "" && <Ionicons name="checkmark" size={20} color={colors.primary} />}
          </TouchableOpacity>

          <FlatList
            data={SPORTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.option, { borderBottomColor: colors.border }]}
                onPress={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
              >
                <Text style={[styles.optionText, { color: colors.foreground }]}>
                  {item.name}
                </Text>
                {value === item.id && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  triggerText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  modal: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
