import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

export type MenuItem = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  danger?: boolean;
};

type DropdownMenuProps = {
  trigger: React.ReactNode;
  items: MenuItem[];
};

const DropdownMenu = ({ trigger, items }: DropdownMenuProps) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        {trigger}
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={[styles.menu, { backgroundColor: colors.surface }]}
          >
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => {
                  item.onPress();
                  setVisible(false);
                }}
              >
                {item.icon && (
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={item.danger ? "#ef4444" : colors.text}
                    style={styles.icon}
                  />
                )}
                <Text
                  style={[
                    styles.menuText,
                    {
                      color: item.danger ? "#ef4444" : colors.text,
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menu: {
    minWidth: 200,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  icon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
  },
});

export default DropdownMenu;