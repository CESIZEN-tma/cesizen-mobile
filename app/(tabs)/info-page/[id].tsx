import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "@/hooks/themeHooks";
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "@/app/services/api/apiClient";
import { ENDPOINTS } from "@/app/services/api/endpoints";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type InfoPage = {
  id: string;
  title: string;
  description: string;
  content: string;
};

type HtmlBlock =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "li"; text: string };

function decodeEntities(str: string): string {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripInlineTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, ""));
}

function parseHtml(html: string): HtmlBlock[] {
  const blocks: HtmlBlock[] = [];
  const pattern = /<(h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(html)) !== null) {
    const tag = match[1].toLowerCase() as HtmlBlock["kind"];
    const text = stripInlineTags(match[2]).trim();
    if (text) blocks.push({ kind: tag, text } as HtmlBlock);
  }
  return blocks;
}

export default function InfoPageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [page, setPage] = useState<InfoPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setIsLoading(true);
        const data = await apiClient.get(ENDPOINTS.CONTENT.GET_PAGE_BY_ID(id));
        setPage(data);
      } catch {
        setError("Impossible de charger la page.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  const renderBlocks = (html: string) => {
    const blocks = parseHtml(html);
    return blocks.map((block, i) => {
      switch (block.kind) {
        case "h2":
          return (
            <Text key={i} style={[styles.h2, { color: colors.text }]}>
              {block.text}
            </Text>
          );
        case "h3":
          return (
            <Text key={i} style={[styles.h3, { color: colors.text }]}>
              {block.text}
            </Text>
          );
        case "p":
          return (
            <Text key={i} style={[styles.paragraph, { color: colors.text }]}>
              {block.text}
            </Text>
          );
        case "li":
          return (
            <View key={i} style={styles.listItem}>
              <Text style={[styles.bullet, { color: colors.primary }]}>{"•"}</Text>
              <Text style={[styles.listItemText, { color: colors.text }]}>
                {block.text}
              </Text>
            </View>
          );
      }
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} importantForAccessibility="no" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
          {page?.title ?? "Article"}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textSecondary} importantForAccessibility="no" />
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>{error}</Text>
        </View>
      ) : page ? (
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.title, { color: colors.text }]}>{page.title}</Text>
          {page.description ? (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {page.description}
            </Text>
          ) : null}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          {renderBlocks(page.content)}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 32,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  h2: {
    fontSize: 19,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    lineHeight: 26,
  },
  h3: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 8,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 18,
    lineHeight: 24,
    marginRight: 8,
    fontWeight: "700",
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
});
