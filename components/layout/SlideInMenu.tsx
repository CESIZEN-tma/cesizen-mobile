import { useTheme } from "@/hooks/themeHooks";
import { apiClient } from "@/app/services/api/apiClient";
import { ENDPOINTS } from "@/app/services/api/endpoints";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
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

type NavigationMenuDto = {
  id: string;
  parentId?: string | null;
  position: number;
  label: string;
  url?: string | null;
  children: NavigationMenuDto[];
};

const INFO_PAGE_SCHEME = "cesizen://info-page/";

type SlideInMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SubMenuRow = ({
  item,
  onClose,
  colors,
  router,
}: {
  item: NavigationMenuDto;
  onClose: () => void;
  colors: any;
  router: ReturnType<typeof useRouter>;
}) => {
  const handlePress = () => {
    if (!item.url) return;
    if (item.url.startsWith(INFO_PAGE_SCHEME)) {
      const pageId = item.url.slice(INFO_PAGE_SCHEME.length);
      router.push(`/(tabs)/info-page/${pageId}` as any);
    } else {
      Linking.openURL(item.url).catch(() => {});
    }
    onClose();
  };

  return (
    <TouchableOpacity style={styles.subItem} onPress={handlePress} activeOpacity={0.7}>
      <Ionicons name="return-down-forward-outline" size={14} color={colors.textSecondary} style={styles.subIcon} />
      <Text style={[styles.subItemText, { color: colors.textSecondary }]}>{item.label}</Text>
    </TouchableOpacity>
  );
};

const MenuRow = ({
  item,
  onClose,
  colors,
  router,
}: {
  item: NavigationMenuDto;
  onClose: () => void;
  colors: any;
  router: ReturnType<typeof useRouter>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handlePress = () => {
    if (hasChildren) {
      setExpanded((prev) => !prev);
    } else {
      if (item.url) {
        if (item.url.startsWith(INFO_PAGE_SCHEME)) {
          const pageId = item.url.slice(INFO_PAGE_SCHEME.length);
          router.push(`/(tabs)/info-page/${pageId}` as any);
        } else {
          Linking.openURL(item.url).catch(() => {});
        }
      }
      onClose();
    }
  };

  return (
    <>
      <TouchableOpacity style={styles.menuItem} onPress={handlePress} activeOpacity={0.7}>
        <Text style={[styles.menuItemText, { color: colors.text }]}>{item.label}</Text>
        {hasChildren && (
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textSecondary}
          />
        )}
      </TouchableOpacity>

      {hasChildren && expanded &&
        item.children
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((child) => (
            <SubMenuRow key={child.id} item={child} onClose={onClose} colors={colors} router={router} />
          ))}
    </>
  );
};

const SlideInMenu = ({ isOpen, onClose }: SlideInMenuProps) => {
  const { colors } = useTheme();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const [isVisible, setIsVisible] = useState(false);
  const [menus, setMenus] = useState<NavigationMenuDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) loadMenus();
  }, [isOpen]);

  const loadMenus = async () => {
    try {
      setIsLoading(true);
      const data: NavigationMenuDto[] = await apiClient.get(ENDPOINTS.CONTENT.GET_MENUS);
      const sorted = (data ?? []).sort((a, b) => a.position - b.position);
      setMenus(sorted);
    } catch {
      // liste vide si l'API échoue
    } finally {
      setIsLoading(false);
    }
  };

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
      }).start(() => setIsVisible(false));
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            styles.menuContainer,
            {
              backgroundColor: colors.background,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea} edges={["top", "bottom", "left"]}>
            <View
              style={[
                styles.menuHeader,
                { backgroundColor: colors.surface, borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.menuTitle, { color: colors.text }]}>Menu</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
              {isLoading ? (
                <View style={styles.centeredContainer}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : menus.length === 0 ? (
                <View style={styles.centeredContainer}>
                  <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                    Aucun lien disponible
                  </Text>
                </View>
              ) : (
                menus.map((item, index) => (
                  <View key={item.id}>
                    <MenuRow item={item} onClose={onClose} colors={colors} router={router} />
                    {index < menus.length - 1 && (
                      <View style={[styles.separator, { backgroundColor: colors.border }]} />
                    )}
                  </View>
                ))
              )}
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
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    paddingLeft: 36,
  },
  subIcon: {
    marginRight: 8,
  },
  subItemText: {
    fontSize: 14,
    fontWeight: "400",
  },
  separator: {
    height: 1,
    marginHorizontal: 24,
  },
  centeredContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
});

export default SlideInMenu;
