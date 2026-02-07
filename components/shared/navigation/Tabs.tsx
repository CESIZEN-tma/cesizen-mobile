import { useTheme } from "@/hooks/themeHooks";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

export type Tab = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultIndex?: number;
};

const Tabs = ({ tabs, defaultIndex = 0 }: TabsProps) => {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveIndex(index)}
            style={[
              styles.tab,
              activeIndex === index && {
                borderBottomColor: colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeIndex === index ? colors.primary : colors.text,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.content}>{tabs[activeIndex].content}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default Tabs;