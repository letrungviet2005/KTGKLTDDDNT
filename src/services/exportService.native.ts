import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { exportRecords, listUsers } from "./userService";
export async function exportUsers() {
  if (!(await Sharing.isAvailableAsync()))
    throw new Error(
      "Thiết bị không hỗ trợ chia sẻ tệp. Vui lòng xuất trên web.",
    );
  const data = exportRecords(await listUsers());
  const file = new File(Paths.cache, `users-${Date.now()}.json`);
  try {
    file.write(JSON.stringify(data, null, 2));
    await Sharing.shareAsync(file.uri, {
      mimeType: "application/json",
      dialogTitle: "Xuất dữ liệu người dùng",
    });
  } finally {
    if (file.exists) file.delete();
  }
}
