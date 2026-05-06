import { useTheme } from "@/hooks/themeHooks";
import React, { ReactNode } from "react";
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  size?: "small" | "medium" | "large" | "full";
};

const Modal = ({
  visible,
  onClose,
  children,
  showCloseButton = true,
  size = "medium",
}: ModalProps) => {
  const { colors } = useTheme();

  const sizeStyles: Record<string, object> = {
    small: { width: "70%" },
    medium: { width: "85%" },
    large: { width: "95%" },
    full: { width: "100%", height: "100%" },
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
            sizeStyles[size],
          ]}
        >
          {showCloseButton && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <ScrollView contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    borderRadius: 16,
    maxHeight: "80%",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 1,
    padding: 8,
  },
  content: {
    paddingTop: 40,
  },
});

export default Modal;