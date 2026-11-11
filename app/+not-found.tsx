import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, styles } from "../src/components/common/UI";
export default function NotFound() {
  return (
    <View style={[styles.card, { margin: 24 }]}>
      <Text style={styles.title}>Không tìm thấy trang</Text>
      <Button title="Về trang chủ" onPress={() => router.replace("/")} />
    </View>
  );
}
