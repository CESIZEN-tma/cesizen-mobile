import { useTheme } from "@/hooks/themeHooks";
import React, { ReactNode } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Footer from "./layout/footer";
import Header from "./layout/header";

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {header && <Header onMenuPress={() => console.log("Menu")} />}

      <Content
        style={styles.content}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}
      >
        {children}
      </Content>

      {footer && <Footer />}
    </View>
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
    paddingBottom: 80,
  },
});

export default PageLayout;
