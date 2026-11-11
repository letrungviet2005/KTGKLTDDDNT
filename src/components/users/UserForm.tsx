import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { UserRecord } from "../../types/user";
import { DEMO_PASSWORD } from "../../utils/validation";
import { errorMessage } from "../../utils/errors";
import { saveUser } from "../../services/userService";
import { pickAvatar } from "../../services/imageService";
import { Avatar, Button, Field, Notice, PageTitle, styles } from "../common/UI";
import { colors as c } from "../../constants/theme";
export function UserForm({ user }: { user?: UserRecord }) {
  const [hoten, setName] = useState(user?.hoten ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [image, setImage] = useState(user?.hinhanh ?? "");
  const [saving, setSaving] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  async function pick() {
    setProcessing(true);
    setError("");
    try {
      const uri = await pickAvatar();
      if (uri !== null) setImage(uri);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setProcessing(false);
    }
  }
  async function submit() {
    if (saving || processing) return;
    setSaving(true);
    setError("");
    try {
      const id = await saveUser(
        { email, hoten, hinhanh: image, matkhau: DEMO_PASSWORD },
        user?.id,
      );
      router.replace({ pathname: "/users/[id]", params: { id, saved: "1" } });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  }
  const disabled = saving || processing;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <PageTitle
          title={user ? "Chỉnh sửa hồ sơ" : "Thêm người dùng"}
          subtitle="Thông tin rõ ràng, hồ sơ đầy đủ."
        >
          <Button
            title="Quay lại danh sách"
            variant="secondary"
            disabled={disabled}
            onPress={() => router.replace("/users")}
          />
        </PageTitle>
        <View style={[styles.card, { maxWidth: 820, width: "100%", gap: 24 }]}>
          <Text style={styles.section}>Thông tin người dùng</Text>
          <Notice text={error} />
          <Field
            label="Họ tên *"
            value={hoten}
            onChangeText={setName}
            placeholder="Nguyễn Văn An"
            maxLength={100}
            editable={!disabled}
            autoComplete="name"
          />
          <Field
            label="Email *"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            maxLength={254}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            spellCheck={false}
            autoComplete="email"
            editable={!disabled}
          />
          <View
            style={{
              backgroundColor: c.pale,
              padding: 16,
              borderRadius: 12,
              gap: 6,
            }}
          >
            <Text style={styles.label}>Mật khẩu theo cấu trúc đề bài</Text>
            <Text style={{ color: c.primary, fontWeight: "600" }}>
              {DEMO_PASSWORD}
            </Text>
            <Text style={styles.subtitle}>
              Giá trị minh họa được điền tự động. Hồ sơ này không tạo tài khoản
              đăng nhập và không lưu mật khẩu thật.
            </Text>
          </View>
          <View style={{ gap: 16 }}>
            <Text style={styles.label}>Hình ảnh</Text>
            <View style={styles.row}>
              <Avatar name={hoten} uri={image} size={88} />
              <View style={{ flex: 1, gap: 10, minWidth: 160 }}>
                <View style={styles.row}>
                  <Button
                    title="Chọn ảnh"
                    icon="image-outline"
                    variant="secondary"
                    busy={processing}
                    disabled={saving}
                    onPress={() => void pick()}
                  />
                  {!!image && (
                    <Button
                      title="Xóa ảnh"
                      variant="secondary"
                      disabled={disabled}
                      onPress={() => setImage("")}
                    />
                  )}
                </View>
                <Text style={styles.subtitle}>
                  JPG / PNG · Tự động thu nhỏ tối đa 256 px, nén JPEG và giới
                  hạn 100 KiB.
                </Text>
                {!!image && (
                  <Text style={{ color: c.success, fontSize: 12 }}>
                    Data URI: {(image.length / 1024).toFixed(1)} KiB
                  </Text>
                )}
              </View>
            </View>
          </View>
          <View
            style={[
              styles.row,
              {
                borderTopWidth: 1,
                borderColor: c.border,
                paddingTop: 24,
                justifyContent: "flex-end",
              },
            ]}
          >
            <Button
              title="Hủy"
              variant="secondary"
              disabled={disabled}
              onPress={() => router.replace("/users")}
            />
            <Button
              title={user ? "Lưu thay đổi" : "Tạo người dùng"}
              icon="checkmark"
              busy={saving}
              disabled={processing}
              onPress={() => void submit()}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
