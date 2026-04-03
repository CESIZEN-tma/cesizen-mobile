import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from "react-native";

type SearchBarProps = TextInputProps & {
  onClear?: () => void;
  showClearButton?: boolean;
};

const SearchBar = ({
  onClear,
  showClearButton = true,
  ...props
}: SearchBarProps) => {
  const { colors } = useTheme();
  const hasValue = props.value && props.value.length > 0;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <Ionicons
        name="search"
        size={20}
        color={colors.border}
        style={styles.searchIcon}
      />
      
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholderTextColor={colors.border}
        placeholder="Search..."
        {...props}
      />
      
      {showClearButton && hasValue && (
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={colors.border} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar;