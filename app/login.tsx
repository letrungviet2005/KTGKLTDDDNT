import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../src/hooks/useAuth";
import { login } from "../src/services/authService";
import { configurationError } from "../src/config/firebase";
import { errorMessage } from "../src/utils/errors";
import {
  Button,
  Field,
  Loading,
  Notice,
  styles,
} from "../src/components/common/UI";
import { colors as c } from "../src/constants/theme";
export default function Login() {
  const { isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const wide = useWindowDimensions().width >= 900;
  async function submit() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await login(email, password);
      setPassword("");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  if (loading) return <Loading />;
  if (isAdmin) return <Redirect href="/" />;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: c.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, flexDirection: wide ? "row" : "column" }}>
          <View
            style={{
              backgroundColor: c.navy,
              padding: wide ? 64 : 28,
              flex: wide ? 1 : undefined,
              justifyContent: "center",
              gap: 30,
            }}
          >
            <View style={styles.row}>
              <Ionicons name="people" size={30} color="#80B4FF" />
              <Text style={{ color: "#FFF", fontSize: 19, fontWeight: "700" }}>
                User Management
              </Text>
            </View>
            <View style={{ gap: 18 }}>
              <Text
                style={{
                  color: "#90BFFF",
                  letterSpacing: 3,
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                ADMIN WORKSPACE
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: wide ? 48 : 30,
                  fontWeight: "700",
                  lineHeight: wide ? 58 : 40,
                }}
              >
                Quản lý tập trung.{"\n"}Kết nối dễ dàng.
              </Text>
              <Text
                style={{
                  color: "#B9CAE2",
                  fontSize: 16,
                  lineHeight: 27,
                  maxWidth: 420,
                }}
              >
                Không gian quản trị người dùng rõ ràng, trực quan và đồng bộ
                cùng Firebase.
              </Text>
            </View>
            {wide && (
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: "#314462",
                  paddingTop: 28,
                  gap: 16,
                }}
              >
                {[
                  "Hồ sơ người dùng trong một nơi",
                  "Dữ liệu thật từ Cloud Firestore",
                  "Trải nghiệm web & Android",
                ].map((t) => (
                  <View key={t} style={styles.row}>
                    <Ionicons
                      name="checkmark-circle"
                      color="#80B4FF"
                      size={20}
                    />
                    <Text style={{ color: "#D9E5F6" }}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1,
              padding: wide ? 56 : 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ width: "100%", maxWidth: 420, gap: 22 }}>
              <View>
                <Text style={styles.title}>Chào mừng trở lại</Text>
                <Text style={styles.subtitle}>
                  Đăng nhập tài khoản Admin để tiếp tục.
                </Text>
              </View>
              <Notice text={configurationError || error} />
              <Field
                label="Email Admin"
                value={email}
                onChangeText={setEmail}
                placeholder="admin@example.com"
                keyboardType="email-address"
                autoCorrect={false}
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="email"
                editable={!busy}
              />
              <Field
                label="Mật khẩu"
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu"
                secureTextEntry={!visible}
                autoCapitalize="none"
                autoComplete="current-password"
                editable={!busy}
                onSubmitEditing={() => void submit()}
              />
              <Button
                title={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                variant="secondary"
                icon={visible ? "eye-off-outline" : "eye-outline"}
                onPress={() => setVisible(!visible)}
              />
              <Button
                title="Đăng nhập"
                icon="arrow-forward"
                onPress={() => void submit()}
                busy={busy}
                disabled={!!configurationError}
              />
              <View style={styles.row}>
                <Ionicons
                  name="shield-checkmark-outline"
                  color={c.muted}
                  size={18}
                />
                <Text style={[styles.subtitle, { flex: 1, marginTop: 0 }]}>
                  Chỉ tài khoản Admin được cấp quyền truy cập.
                </Text>
              </View>
              <Text style={[styles.subtitle, { fontSize: 12 }]}>
                USER MANAGEMENT SYSTEM · BÀI KIỂM TRA GIỮA KỲ
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
