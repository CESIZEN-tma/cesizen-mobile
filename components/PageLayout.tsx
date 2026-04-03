import { useTheme } from "@/hooks/themeHooks";
import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Footer from "./layout/Footer";
import Header from "./layout/Header";

type PageLayoutProps = {
  children: ReactNode;
  header?: boolean;
  footer?: boolean;
  scrollable?: boolean;
};

const PageLayout = ({
  children,
  header = false,
  footer = false,
  scrollable = true,
}: PageLayoutProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const Content = scrollable ? ScrollView : View;

  const getContentStyle = () => {
    if (scrollable) {
      return footer
        ? { flexGrow: 1, paddingBottom: 80 + insets.bottom }
        : { flexGrow: 1, paddingBottom: insets.bottom + 20 };
    } else {
      return footer
        ? { paddingBottom: 80 + insets.bottom }
        : undefined;
    }
  };

  return (
    <SafeAreaView
      edges={["top", "left", "right"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {header && <Header />}

      <Content
        style={scrollable ? styles.content : [styles.content, getContentStyle()]}
        contentContainerStyle={scrollable ? getContentStyle() : undefined}
      >
        {children}
      </Content>

      {footer && <Footer />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default PageLayout;
