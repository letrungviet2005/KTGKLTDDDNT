import { useState } from "react";
import { Redirect, Slot, router, usePathname } from "expo-router";
import { Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../src/hooks/useAuth";
import { logout } from "../../src/services/authService";
import {
  Button,
  Loading,
  Notice,
  styles,
} from "../../src/components/common/UI";
import { colors as c } from "../../src/constants/theme";
import { errorMessage } from "../../src/utils/errors";
export default function AdminLayout() {
  const { user, loading, isAdmin } = useAuth();
  const wide = useWindowDimensions().width >= 900;
  const path = usePathname();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (loading) return <Loading />;
  if (!isAdmin) return <Redirect href="/login" />;
  const navigation = (
    <>
      <Button
        title="Tổng quan"
        style={!wide ? { flex: 1, paddingHorizontal: 8 } : undefined}
        icon="grid-outline"
        variant={path === "/" ? "primary" : "secondary"}
        onPress={() => router.navigate("/")}
      />
      <Button
        title="Người dùng"
        style={!wide ? { flex: 1, paddingHorizontal: 8 } : undefined}
        icon="people-outline"
        variant={path.startsWith("/users") ? "primary" : "secondary"}
        onPress={() => router.navigate("/users")}
      />
    </>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ flex: 1, flexDirection: wide ? "row" : "column" }}>
        {wide && (
          <View
            style={{
              width: 240,
              backgroundColor: "#FFF",
              padding: 24,
              borderRightWidth: 1,
              borderColor: c.border,
              gap: 14,
            }}
          >
            <View
              style={[styles.row, { paddingVertical: 14, marginBottom: 36 }]}
            >
              <Ionicons name="people" size={30} color={c.primary} />
              <Text style={{ fontSize: 17, fontWeight: "800", color: c.navy }}>
                User Manager
              </Text>
            </View>
            <Text
              style={{
                fontSize: 11,
                color: c.muted,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              KHÔNG GIAN QUẢN TRỊ
            </Text>
            {navigation}
            <View style={{ flex: 1 }} />
            <View
              style={{
                backgroundColor: c.pale,
                padding: 16,
                borderRadius: 12,
                gap: 8,
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color={c.primary}
              />
              <Text style={{ color: c.navy, fontWeight: "600" }}>
                Firebase Authentication
              </Text>
              <Text style={styles.subtitle}>
                Phiên quản trị được xác thực bằng tài khoản Admin.
              </Text>
            </View>
            <Text style={{ color: c.muted, fontSize: 11 }}>
              User Management System · v1.0
            </Text>
          </View>
        )}
        <View style={{ flex: 1, minWidth: 0 }}>
          <View
            style={{
              backgroundColor: "#FFF",
              paddingHorizontal: wide ? 32 : 16,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderColor: c.border,
              gap: 14,
            }}
          >
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", flexWrap: "nowrap" },
              ]}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  numberOfLines={2}
                  style={{ fontWeight: "700", color: c.navy }}
                >
                  User Management System
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 12, color: c.muted, marginTop: 4 }}
                >
                  {user?.email}
                </Text>
              </View>
              <Button
                title="Đăng xuất"
                variant="secondary"
                icon="log-out-outline"
                busy={busy}
                onPress={async () => {
                  setBusy(true);
                  try {
                    await logout();
                  } catch (e) {
                    setError(errorMessage(e));
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </View>
            {!wide && (
              <View
                style={[
                  styles.row,
                  { flexWrap: "nowrap", alignItems: "stretch", gap: 8 },
                ]}
              >
                {navigation}
              </View>
            )}
            <Notice text={error} />
          </View>
          <View style={{ flex: 1, padding: wide ? 32 : 16, minHeight: 0 }}>
            <Slot />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
