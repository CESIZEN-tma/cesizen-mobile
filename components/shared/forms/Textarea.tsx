import { useTheme } from "@/hooks/themeHooks";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";

type TextareaProps = TextInputProps & {
  label?: string;
  error?: string;
  maxLength?: number;
  showCounter?: boolean;
  minHeight?: number;
};

const Textarea = ({
  label,
  error,
  maxLength,
  showCounter = false,
  minHeight = 100,
  ...props
}: TextareaProps) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState(props.value || "");

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}

      <View
        style={[
          styles.textareaContainer,
          {
            borderColor: error
              ? "#ef4444"
              : isFocused
                ? colors.primary
                : colors.border,
            backgroundColor: colors.surface,
            minHeight,
          },
        ]}
      >
        <TextInput
          style={[styles.textarea, { color: colors.text }]}
          placeholderTextColor={colors.border}
          multiline
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={(value) => {
            setText(value);
            props.onChangeText?.(value);
          }}
          maxLength={maxLength}
          {...props}
        />
      </View>

      <View style={styles.footer}>
        {error && <Text style={styles.error}>{error}</Text>}
        {showCounter && maxLength && (
          <Text style={[styles.counter, { color: colors.border }]}>
            {text.length}/{maxLength}
          </Text>
        )}
      </View>
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
  textareaContainer: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
  },
  textarea: {
    fontSize: 16,
    minHeight: 80,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginLeft: 4,
  },
  counter: {
    fontSize: 12,
    marginRight: 4,
  },
});

export default Textarea;
