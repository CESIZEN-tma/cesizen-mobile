import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.75;

type MenuItem = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

type SlideInMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  menuItems?: MenuItem[];
};

const SlideInMenu = ({ isOpen, onClose, menuItems = [] }: SlideInMenuProps) => {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsVisible(false);
      });
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  // Default sample menu items
  const defaultMenuItems: MenuItem[] = [
    {
      label: "Accueil",
      icon: "home-outline",
      onPress: () => {
        handleClose();
      },
    },
    {
      label: "Profil",
      icon: "person-outline",
      onPress: () => {
        handleClose();
      },
    },
    {
      label: "Paramètres",
      icon: "settings-outline",
      onPress: () => {
        handleClose();
      },
    },
    {
      label: "Notifications",
      icon: "notifications-outline",
      onPress: () => {
        handleClose();
      },
    },
    {
      label: "Messages",
      icon: "mail-outline",
      onPress: () => {
        handleClose();
      },
    },
    {
      label: "Favoris",
      icon: "heart-outline",
      onPress: () => {
        handleClose();
      },
    },
    {
      label: "Aide",
      icon: "help-circle-outline",
      onPress: () => {
        handleClose();
      },
    },
    {
      label: "À propos",
      icon: "information-circle-outline",
      onPress: () => {
        handleClose();
      },
    },
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.background,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left']}>
            <View
              style={[
                styles.menuHeader,
                { backgroundColor: colors.surface, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.menuTitle, { color: colors.text }]}>Menu</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.menuContent}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={colors.text}
                      style={styles.menuIcon}
                    />
                    <Text style={[styles.menuItemText, { color: colors.text }]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                  {index < items.length - 1 && (
                    <View
                      style={[styles.separator, { backgroundColor: colors.border }]}
                    />
                  )}
                </View>
              ))}
            </ScrollView>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: MENU_WIDTH,
  },
  safeArea: {
    flex: 1,
  },
  menuHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "700",
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    marginHorizontal: 20,
  },
});

export default SlideInMenu;
