import { useState } from "react";
import { UserRecord } from "../../types/user";
import { removeUser } from "../../services/userService";
import { errorMessage } from "../../utils/errors";
import { ConfirmDialog } from "../common/UI";
export function DeleteUser({
  user,
  onClose,
  onDeleted,
}: {
  user: UserRecord;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <ConfirmDialog
      visible
      name={user.hoten}
      busy={busy}
      error={error}
      onCancel={onClose}
      onDelete={async () => {
        if (busy) return;
        setBusy(true);
        setError("");
        try {
          await removeUser(user.id);
          onDeleted();
        } catch (e) {
          setError(errorMessage(e));
          setBusy(false);
        }
      }}
    />
  );
}
