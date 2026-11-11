import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useUser } from "../../../../src/hooks/useUser";
import { UserForm } from "../../../../src/components/users/UserForm";
import {
  Button,
  Loading,
  Notice,
  styles,
} from "../../../../src/components/common/UI";
export default function EditUser() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, loading, error, retry } = useUser(id);
  if (loading) return <Loading />;
  if (!user)
    return (
      <View style={styles.card}>
        <Notice text={error} />
        <Button title="Thử lại" onPress={retry} />
        <Button
          title="Quay lại danh sách"
          variant="secondary"
          onPress={() => router.replace("/users")}
        />
      </View>
    );
  return <UserForm key={user.id} user={user} />;
}
