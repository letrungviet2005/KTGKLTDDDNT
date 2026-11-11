import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useUsers } from "../../src/hooks/useUsers";
import {
  Avatar,
  Button,
  Loading,
  Notice,
  PageTitle,
  styles,
} from "../../src/components/common/UI";
import { colors as c } from "../../src/constants/theme";
export default function Dashboard() {
  const { users, loading, error, refresh } = useUsers();
  const withPhoto = users.filter((u) => !!u.hinhanh).length;
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <PageTitle
        title="Tổng quan"
        subtitle="Một góc nhìn rõ ràng về dữ liệu người dùng của bạn."
      >
        <Button
          title="Thêm người dùng"
          icon="add"
          onPress={() => router.push("/users/create")}
        />
      </PageTitle>
      <View
        style={{
          backgroundColor: c.navy,
          padding: 28,
          borderRadius: 20,
          gap: 14,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            color: "#90BFFF",
            letterSpacing: 2,
            fontSize: 11,
            fontWeight: "700",
          }}
        >
          USER MANAGEMENT / OVERVIEW
        </Text>
        <Text style={{ color: "#FFF", fontSize: 25, fontWeight: "700" }}>
          Mọi hồ sơ, trong tầm tay.
        </Text>
        <Text style={{ color: "#C0CEE2", lineHeight: 23 }}>
          Thêm, cập nhật và quản lý hồ sơ từ một không gian làm việc thống nhất.
        </Text>
        <View style={styles.row}>
          <Button
            title="Quản lý người dùng"
            icon="arrow-forward"
            onPress={() => router.push("/users")}
          />
          <Button
            title="Làm mới"
            variant="secondary"
            icon="refresh-outline"
            busy={loading}
            onPress={() => void refresh()}
          />
        </View>
      </View>
      <Notice text={error} />
      {loading ? (
        <Loading />
      ) : (
        !error && (
          <>
            <View
              style={[styles.row, { alignItems: "stretch", marginBottom: 24 }]}
            >
              {[
                {
                  title: "Tổng số người dùng",
                  value: users.length,
                  icon: "people-outline" as const,
                  color: c.primary,
                },
                {
                  title: "Đã có ảnh đại diện",
                  value: withPhoto,
                  icon: "image-outline" as const,
                  color: c.success,
                },
                {
                  title: "Chưa có ảnh",
                  value: users.length - withPhoto,
                  icon: "person-outline" as const,
                  color: "#9B6A15",
                },
              ].map((stat) => (
                <View
                  key={stat.title}
                  style={[styles.card, { flex: 1, minWidth: 200 }]}
                >
                  <View
                    style={[styles.row, { justifyContent: "space-between" }]}
                  >
                    <Text style={{ color: c.muted, fontSize: 13 }}>
                      {stat.title}
                    </Text>
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                  </View>
                  <Text
                    style={{ fontSize: 36, fontWeight: "700", color: c.navy }}
                  >
                    {stat.value}
                  </Text>
                  <Text style={{ color: c.muted, fontSize: 12 }}>
                    Từ collection users trên Firestore
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.card}>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <Text style={styles.section}>Danh bạ người dùng</Text>
                <Button
                  title="Xem tất cả"
                  variant="secondary"
                  onPress={() => router.push("/users")}
                />
              </View>
              {users.length === 0 ? (
                <Text style={styles.subtitle}>
                  Chưa có người dùng. Tạo hồ sơ đầu tiên để bắt đầu.
                </Text>
              ) : (
                users.slice(0, 5).map((u) => (
                  <View
                    key={u.id}
                    style={[
                      styles.row,
                      {
                        paddingVertical: 10,
                        borderTopWidth: 1,
                        borderColor: c.border,
                      },
                    ]}
                  >
                    <Avatar name={u.hoten} uri={u.hinhanh} />
                    <View style={{ flex: 1, minWidth: 100 }}>
                      <Text style={{ color: c.text, fontWeight: "600" }}>
                        {u.hoten}
                      </Text>
                      <Text style={styles.subtitle}>{u.email}</Text>
                    </View>
                    <Button
                      title="Chi tiết"
                      variant="secondary"
                      onPress={() =>
                        router.push({
                          pathname: "/users/[id]",
                          params: { id: u.id },
                        })
                      }
                    />
                  </View>
                ))
              )}
            </View>
          </>
        )
      )}
    </ScrollView>
  );
}
