import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateUser,
  DEMO_PASSWORD,
  MAX_IMAGE_BYTES,
  searchUsers,
  validateLoginInput,
} from "../src/utils/validation";
const valid = {
  email: " AN@Example.com ",
  hoten: " Nguyễn Văn An ",
  matkhau: DEMO_PASSWORD,
  hinhanh: "",
};
test("login distinguishes missing password from invalid or missing email", () => {
  assert.throws(
    () => validateLoginInput("admin@example.com", ""),
    /Vui lòng nhập mật khẩu Admin/,
  );
  assert.throws(
    () => validateLoginInput("", "demo"),
    /Vui lòng nhập email Admin/,
  );
  assert.throws(
    () => validateLoginInput("some-admin-uid", "demo"),
    /Email chưa đúng định dạng/,
  );
  assert.throws(
    () => validateLoginInput("admin @example.com", "demo"),
    /Email chưa đúng định dạng/,
  );
});
test("login trims surrounding email whitespace and preserves password exactly", () => {
  assert.deepEqual(validateLoginInput("  admin@example.com  ", " pass word "), {
    email: "admin@example.com",
    password: " pass word ",
  });
});
test("normalizes names and emails while returning exactly four strings", () => {
  const result = validateUser(valid);
  assert.deepEqual(result, {
    email: "an@example.com",
    hoten: "Nguyễn Văn An",
    matkhau: DEMO_PASSWORD,
    hinhanh: "",
  });
  assert.equal(Object.keys(result).length, 4);
});
test("rejects missing, extra and non-string fields", () => {
  assert.throws(() => validateUser({ ...valid, id: "forbidden" }));
  assert.throws(() =>
    validateUser({
      email: valid.email,
      hoten: valid.hoten,
      matkhau: DEMO_PASSWORD,
    }),
  );
  assert.throws(() => validateUser({ ...valid, hinhanh: null }));
});
test("rejects invalid email and blank/oversized names", () => {
  for (const email of [
    "",
    "bad",
    "a@b",
    "a b@example.com",
    "a".repeat(255) + "@x.com",
  ])
    assert.throws(() => validateUser({ ...valid, email }));
  for (const hoten of ["", "  ", "a".repeat(101)])
    assert.throws(() => validateUser({ ...valid, hoten }));
});
test("never accepts a real or hashed password", () => {
  for (const matkhau of ["my-password", "$2a$hash", ""])
    assert.throws(() => validateUser({ ...valid, matkhau }));
});
test("accepts empty or JPEG data URI, refuses oversized payload and other formats", () => {
  assert.ok(validateUser({ ...valid, hinhanh: "data:image/jpeg;base64,YQ==" }));
  for (const hinhanh of [
    "https://example.com/image.jpg",
    "data:image/png;base64,YQ==",
    "data:image/jpeg;base64,",
    "data:image/jpeg;base64,%%%=",
    "data:image/jpeg;base64," + "A".repeat(MAX_IMAGE_BYTES),
  ])
    assert.throws(() => validateUser({ ...valid, hinhanh }));
});
test("search supports Vietnamese diacritics, case and email", () => {
  const data = [
    { hoten: "Đặng Thị Ánh", email: "anh@example.com" },
    { hoten: "Bình", email: "binh@example.com" },
  ];
  assert.equal(searchUsers(data, "DANG THI ANH").length, 1);
  assert.equal(searchUsers(data, "BINH@").length, 1);
  assert.equal(searchUsers(data, "   ").length, 2);
  assert.equal(searchUsers(data, "missing").length, 0);
});
