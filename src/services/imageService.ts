import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { MAX_IMAGE_BYTES } from "../utils/validation";
export async function pickAvatar(): Promise<string | null> {
  if (Platform.OS !== "web") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      throw new Error(
        "Vui lòng cấp quyền truy cập ảnh trong cài đặt thiết bị.",
      );
  }
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: false,
    quality: 1,
  });
  if (result.canceled || !result.assets?.length) return null;
  const asset = result.assets[0];
  const longest = Math.max(asset.width, asset.height);
  const resize =
    longest > 256
      ? [
          {
            resize:
              asset.width >= asset.height ? { width: 256 } : { height: 256 },
          },
        ]
      : [];
  for (const quality of [0.6, 0.4, 0.2]) {
    const image = await manipulateAsync(asset.uri, resize, {
      compress: quality,
      format: SaveFormat.JPEG,
      base64: true,
    });
    if (!image.base64)
      throw new Error(
        "Không thể đọc dữ liệu ảnh. Hãy chọn ảnh JPG hoặc PNG khác.",
      );
    const uri = `data:image/jpeg;base64,${image.base64}`;
    if (uri.length <= MAX_IMAGE_BYTES) return uri;
  }
  throw new Error("Ảnh vẫn vượt 100 KiB sau khi nén. Vui lòng chọn ảnh khác.");
}
