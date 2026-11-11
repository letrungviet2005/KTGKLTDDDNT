import { PropsWithChildren, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors as c } from "../../constants/theme";

export const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: c.navy,
    letterSpacing: -0.8,
  },
  subtitle: { fontSize: 14, color: c.muted, lineHeight: 22, marginTop: 7 },
  card: {
    backgroundColor: c.card,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: c.border,
    gap: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  input: {
    borderWidth: 1,
    borderColor: c.border,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: c.text,
    fontSize: 15,
    minHeight: 48,
  },
  label: { fontSize: 13, fontWeight: "600", color: c.text, marginBottom: 8 },
  section: { fontSize: 18, fontWeight: "700", color: c.navy },
});
export function Button({
  title,
  onPress,
  variant = "primary",
  disabled,
  busy,
  icon,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  busy?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  const foreground = variant === "secondary" ? c.text : "#FFF";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        {
          minHeight: 44,
          minWidth: 0,
          maxWidth: "100%",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 10,
          flexDirection: "row",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            variant === "secondary"
              ? "#EDF2F9"
              : variant === "danger"
                ? c.danger
                : c.primary,
          opacity: disabled || busy ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {busy ? (
        <ActivityIndicator size="small" color={foreground} />
      ) : icon ? (
        <Ionicons name={icon} color={foreground} size={17} />
      ) : null}
      <Text
        style={{
          fontWeight: "600",
          color: foreground,
          fontSize: 14,
          flexShrink: 1,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#94A3B8"
        {...props}
        style={[styles.input, props.style]}
      />
    </View>
  );
}
export function Notice({
  text,
  success = false,
}: {
  text: string;
  success?: boolean;
}) {
  if (!text) return null;
  return (
    <View
      accessibilityRole="alert"
      style={{
        padding: 14,
        backgroundColor: success ? "#E8F7F0" : "#FFF1EF",
        borderRadius: 10,
      }}
    >
      <Text style={{ color: success ? c.success : c.danger, lineHeight: 21 }}>
        {text}
      </Text>
    </View>
  );
}
export function Loading() {
  return (
    <View style={{ padding: 48, gap: 16, alignItems: "center" }}>
      <ActivityIndicator color={c.primary} />
      <Text style={styles.subtitle}>Đang tải dữ liệu…</Text>
    </View>
  );
}
export function Avatar({
  name,
  uri,
  size = 44,
}: {
  name: string;
  uri?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState("");
  return uri && failed !== uri ? (
    <Image
      source={{ uri }}
      onError={() => setFailed(uri)}
      accessibilityLabel={`Ảnh của ${name}`}
      style={{ width: size, height: size, borderRadius: size / 3 }}
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 3,
        backgroundColor: "#E7EFFF",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{ color: c.primary, fontWeight: "700", fontSize: size * 0.34 }}
      >
        {name
          .trim()
          .split(/\s+/)
          .slice(-2)
          .map((s) => s[0])
          .join("")
          .toUpperCase() || "U"}
      </Text>
    </View>
  );
}
export function PageTitle({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title: string; subtitle: string }>) {
  const compact = useWindowDimensions().width < 600;
  return (
    <View
      style={[
        styles.row,
        { justifyContent: "space-between", marginBottom: 24 },
        compact && { flexDirection: "column", alignItems: "stretch", gap: 16 },
      ]}
    >
      <View style={{ flexGrow: compact ? 0 : 1, flexShrink: 1, minWidth: 0 }}>
        <Text
          accessibilityRole="header"
          style={[styles.title, compact && { fontSize: 26 }]}
        >
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      {children}
    </View>
  );
}
export function ConfirmDialog({
  visible,
  name,
  busy,
  error,
  onCancel,
  onDelete,
}: {
  visible: boolean;
  name: string;
  busy: boolean;
  error: string;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!busy) onCancel();
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "#10234288",
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <View
          accessibilityViewIsModal
          style={[styles.card, { width: "100%", maxWidth: 460 }]}
        >
          <Ionicons name="trash-outline" size={30} color={c.danger} />
          <Text style={styles.section}>Xóa người dùng?</Text>
          <Text style={styles.subtitle}>
            Bạn sắp xóa hồ sơ “{name}”. Thao tác này không thể hoàn tác.
          </Text>
          <Notice text={error} />
          <View style={[styles.row, { justifyContent: "flex-end" }]}>
            <Button
              title="Hủy"
              variant="secondary"
              onPress={onCancel}
              disabled={busy}
            />
            <Button
              title="Xóa người dùng"
              variant="danger"
              onPress={onDelete}
              busy={busy}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
