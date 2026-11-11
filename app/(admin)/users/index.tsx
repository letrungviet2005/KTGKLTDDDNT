import { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUsers } from "../../../src/hooks/useUsers";
import { UserRecord } from "../../../src/types/user";
import { searchUsers } from "../../../src/utils/validation";
import { errorMessage } from "../../../src/utils/errors";
import { exportUsers } from "../../../src/services/exportService";
import {
  Avatar,
  Button,
  Loading,
  Notice,
  PageTitle,
  styles,
} from "../../../src/components/common/UI";
import { DeleteUser } from "../../../src/components/users/DeleteUser";
import { colors as c } from "../../../src/constants/theme";
export default function Users() {
  const { users, loading, error, refresh } = useUsers();
  const params = useLocalSearchParams<{ success?: string }>();
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<UserRecord | null>(null);
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [exporting, setExporting] = useState(false);
  const { width, fontScale } = useWindowDimensions();
  const [contentWidth, setContentWidth] = useState(0);
  // Use the space left after sidebar/padding, not the device width.
  const wide = contentWidth >= 960 && fontScale <= 1.2;
  const compact = width < 600;
  const stackActions = width < 360 || fontScale > 1.2;
  const filtered = useMemo(() => searchUsers(users, query), [users, query]);
  return (
    <View
      style={{ flex: 1, minWidth: 0 }}
      onLayout={({ nativeEvent }) => setContentWidth(nativeEvent.layout.width)}
    >
      <FlatList
        data={loading || error ? [] : filtered}
        keyExtractor={(u) => u.id}
        refreshing={loading}
        onRefresh={() => void refresh()}
        contentContainerStyle={{ paddingBottom: 32, gap: 10 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={{ flex: 1, minWidth: 0 }}
        ListHeaderComponent={
          <View style={{ gap: 16, paddingBottom: 8 }}>
            <PageTitle
              title="Người dùng"
              subtitle="Quản lý hồ sơ, tìm kiếm và cập nhật thông tin."
            >
              <View
                style={[
                  styles.row,
                  compact && {
                    width: "100%",
                    flexDirection: "column",
                    alignItems: "stretch",
                  },
                ]}
              >
                <Button
                  title="Xuất JSON"
                  icon="download-outline"
                  variant="secondary"
                  busy={exporting}
                  onPress={async () => {
                    setExporting(true);
                    setActionError("");
                    try {
                      await exportUsers();
                      setMessage(
                        "Đã chuẩn bị tệp JSON để tải xuống hoặc chia sẻ.",
                      );
                    } catch (e) {
                      setActionError(errorMessage(e));
                    } finally {
                      setExporting(false);
                    }
                  }}
                />
                <Button
                  title="Thêm người dùng"
                  icon="add"
                  onPress={() => router.push("/users/create")}
                />
              </View>
            </PageTitle>
            <Notice
              text={
                message ||
                (params.success === "deleted" ? "Đã xóa người dùng." : "")
              }
              success
            />
            <Notice text={error || actionError} />
            <View style={[styles.card, { padding: 16 }]}>
              <View
                style={{
                  flexDirection: compact ? "column" : "row",
                  gap: 12,
                  alignItems: compact ? "stretch" : "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    flex: compact ? undefined : 1,
                    minWidth: 0,
                  }}
                >
                  <Ionicons name="search-outline" size={22} color={c.muted} />
                  <TextInput
                    accessibilityLabel="Tìm kiếm người dùng"
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Tìm tên hoặc email…"
                    placeholderTextColor={c.muted}
                    style={[styles.input, { flex: 1, minWidth: 0 }]}
                    autoCorrect={false}
                  />
                </View>
                <Button
                  title="Làm mới"
                  variant="secondary"
                  icon="refresh-outline"
                  busy={loading}
                  onPress={() => void refresh()}
                />
              </View>
              <Text style={{ color: c.muted, fontSize: 12 }}>
                {!loading && !error
                  ? `${filtered.length} / ${users.length} hồ sơ`
                  : "Dữ liệu từ Cloud Firestore"}
              </Text>
            </View>
            {wide && (
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 24,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ flex: 1, color: c.muted, fontSize: 12 }}>
                  HỌ TÊN
                </Text>
                <Text style={{ flex: 1, color: c.muted, fontSize: 12 }}>
                  EMAIL
                </Text>
                <Text
                  style={{
                    width: 260,
                    textAlign: "right",
                    color: c.muted,
                    fontSize: 12,
                  }}
                >
                  THAO TÁC
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <Loading />
          ) : error ? (
            <View style={styles.card}>
              <Text style={styles.subtitle}>
                Không tải được danh sách. Kiểm tra kết nối hoặc quyền truy cập
                rồi bấm Làm mới.
              </Text>
            </View>
          ) : (
            <View style={[styles.card, { alignItems: "center", padding: 40 }]}>
              <Ionicons name="people-outline" color={c.primary} size={40} />
              <Text style={styles.section}>
                {query ? "Không tìm thấy kết quả" : "Chưa có người dùng"}
              </Text>
              <Text style={styles.subtitle}>
                {query
                  ? "Thử tìm bằng từ khóa khác."
                  : "Thêm hồ sơ đầu tiên để bắt đầu quản lý."}
              </Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                flexDirection: wide ? "row" : "column",
                alignItems: wide ? "center" : "stretch",
                padding: compact ? 16 : 20,
              },
            ]}
          >
            <View
              style={[
                styles.row,
                { flex: wide ? 1 : undefined, flexWrap: "nowrap", minWidth: 0 },
              ]}
            >
              <Avatar name={item.hoten} uri={item.hinhanh} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text
                  style={{ color: c.navy, fontWeight: "700", fontSize: 15 }}
                  numberOfLines={2}
                >
                  {item.hoten}
                </Text>
                {!wide && (
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="middle"
                    style={styles.subtitle}
                  >
                    {item.email}
                  </Text>
                )}
              </View>
            </View>
            {wide && (
              <Text
                numberOfLines={2}
                ellipsizeMode="middle"
                style={{ flex: 1, minWidth: 0, color: c.muted }}
              >
                {item.email}
              </Text>
            )}
            <View
              style={[
                styles.row,
                {
                  justifyContent: wide ? "flex-end" : "flex-start",
                  gap: 8,
                  flexWrap: "nowrap",
                  width: wide ? 260 : "100%",
                  flexDirection: !wide && stackActions ? "column" : "row",
                  alignItems: "stretch",
                },
              ]}
            >
              <Button
                title="Xem"
                style={
                  !wide && !stackActions
                    ? { flex: 1, paddingHorizontal: 8 }
                    : undefined
                }
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: "/users/[id]",
                    params: { id: item.id },
                  })
                }
              />
              <Button
                title="Sửa"
                style={
                  !wide && !stackActions
                    ? { flex: 1, paddingHorizontal: 8 }
                    : undefined
                }
                icon="create-outline"
                variant="secondary"
                onPress={() =>
                  router.push({
                    pathname: "/users/edit/[id]",
                    params: { id: item.id },
                  })
                }
              />
              <Button
                title="Xóa"
                style={
                  !wide && !stackActions
                    ? { flex: 1, paddingHorizontal: 8 }
                    : undefined
                }
                variant="danger"
                onPress={() => setTarget(item)}
              />
            </View>
          </View>
        )}
      />
      {target && (
        <DeleteUser
          user={target}
          onClose={() => setTarget(null)}
          onDeleted={() => {
            setTarget(null);
            setMessage("Đã xóa người dùng.");
            void refresh();
          }}
        />
      )}
    </View>
  );
}
