import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

const Select = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  disabled = false,
}: SelectProps) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        style={[
          styles.selectButton,
          {
            borderColor: error ? "#ef4444" : colors.border,
            backgroundColor: colors.surface,
          },
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.selectedText,
            {
              color: selectedOption ? colors.text : colors.border,
            },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.text}
        />
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && {
                      backgroundColor: colors.primary + "20",
                    },
                  ]}
                  onPress={() => {
                    onChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color:
                          item.value === value ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  selectedText: {
    fontSize: 16,
    flex: 1,
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxHeight: "60%",
    borderRadius: 12,
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Select;