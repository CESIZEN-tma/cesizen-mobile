import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type TimePickerProps = {
  label?: string;
  value: Date;
  onChange: (time: Date) => void;
  error?: string;
  disabled?: boolean;
};

const TimePicker = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
}: TimePickerProps) => {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleChange = (_event: any, selectedTime?: Date) => {
    setShow(Platform.OS === "ios");
    if (selectedTime) {
      onChange(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !disabled && setShow(true)}
        disabled={disabled}
        style={[
          styles.timeButton,
          {
            borderColor: error ? "#ef4444" : colors.border,
            backgroundColor: colors.surface,
          },
          disabled && styles.disabled,
        ]}
      >
        <Ionicons
          name="time"
          size={20}
          color={colors.text}
          style={styles.icon}
        />
        <Text style={[styles.timeText, { color: colors.text }]}>
          {formatTime(value)}
        </Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {show && (
        <DateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
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
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  icon: {
    marginRight: 8,
  },
  timeText: {
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
});

export default TimePicker;