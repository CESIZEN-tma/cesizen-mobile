import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";

type AccordionProps = {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
};

const Accordion = ({
  title,
  children,
  defaultExpanded = false,
}: AccordionProps) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const animation = useRef(new Animated.Value(defaultExpanded ? 1 : 0)).current;

  const toggleExpand = () => {
    const toValue = expanded ? 0 : 1;
    setExpanded(!expanded);

    Animated.spring(animation, {
      toValue,
      useNativeDriver: false,
    }).start();
  };

  const rotateInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons name="chevron-down" size={24} color={colors.text} />
        </Animated.View>
      </TouchableOpacity>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});

export default Accordion;