import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useUser } from "../../../src/hooks/useUser";
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
export default function UserDetail() {
  const { id, saved } = useLocalSearchParams<{ id: string; saved?: string }>();
  const { user, loading, error, retry } = useUser(id);
  const [deleting, setDeleting] = useState(false);
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <PageTitle
        title="Chi tiết người dùng"
        subtitle="Thông tin hồ sơ trong hệ thống."
      >
        <Button
          title="Quay lại danh sách"
          variant="secondary"
          onPress={() => router.replace("/users")}
        />
      </PageTitle>
      {loading ? (
        <Loading />
      ) : !user ? (
        <View style={styles.card}>
          <Notice text={error} />
          <Button title="Thử lại" onPress={retry} />
        </View>
      ) : (
        <View style={[styles.card, { maxWidth: 820 }]}>
          {saved === "1" && <Notice text="Đã lưu hồ sơ thành công." success />}
          <View style={[styles.row, { paddingVertical: 16 }]}>
            <Avatar name={user.hoten} uri={user.hinhanh} size={96} />
            <View style={{ flex: 1, minWidth: 150 }}>
              <Text style={styles.title}>{user.hoten}</Text>
              <Text style={styles.subtitle}>Hồ sơ người dùng</Text>
            </View>
          </View>
          <View
            style={{
              borderTopWidth: 1,
              borderColor: c.border,
              paddingVertical: 20,
              gap: 20,
            }}
          >
            <View>
              <Text style={styles.label}>Họ tên</Text>
              <Text selectable style={{ color: c.text, fontSize: 16 }}>
                {user.hoten}
              </Text>
            </View>
            <View>
              <Text style={styles.label}>Email</Text>
              <Text selectable style={{ color: c.text, fontSize: 16 }}>
                {user.email}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <Button
              title="Chỉnh sửa"
              icon="create-outline"
              onPress={() =>
                router.push({
                  pathname: "/users/edit/[id]",
                  params: { id: user.id },
                })
              }
            />
            <Button
              title="Xóa người dùng"
              icon="trash-outline"
              variant="danger"
              onPress={() => setDeleting(true)}
            />
          </View>
          {deleting && (
            <DeleteUser
              user={user}
              onClose={() => setDeleting(false)}
              onDeleted={() =>
                router.replace({
                  pathname: "/users",
                  params: { success: "deleted" },
                })
              }
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}
