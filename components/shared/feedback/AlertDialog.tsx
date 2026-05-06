import { useTheme } from "@/hooks/themeHooks";
import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
} from "react-native";
import PressableButton from "../PressButton";

type AlertDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "default" | "danger";
};

const AlertDialog = ({
  visible,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "default",
}: AlertDialogProps) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[styles.dialog, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.text }]}>
            {message}
          </Text>

          <View style={styles.buttons}>
            <PressableButton
              label={cancelText}
              onPress={onCancel}
              width={120}
            />
            <PressableButton
              label={confirmText}
              onPress={onConfirm}
              width={120}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    width: "85%",
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});

export default AlertDialog;