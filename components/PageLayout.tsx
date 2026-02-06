import { useTheme } from "@/hooks/themeHooks";
import React, { ReactNode } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
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

  const Content = scrollable ? ScrollView : View;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {header && <Header onMenuPress={() => console.log("Menu")} />}

      <Content
        style={styles.content}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default PageLayout;
