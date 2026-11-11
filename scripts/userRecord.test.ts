import { test } from "node:test";
import assert from "node:assert/strict";
import { readUserRecord } from "../src/utils/userRecord";
import { DEMO_PASSWORD, validateUser } from "../src/utils/validation";

test("legacy invalid email remains readable but cannot be saved unchanged", () => {
  const record = readUserRecord("legacy", {
    email: "invalid-email",
    hoten: "Người dùng cũ",
    matkhau: "demo_placeholder",
    hinhanh: "",
  });
  assert.equal(record.email, "invalid-email");
  assert.equal(record.hoten, "Người dùng cũ");
  const { id, ...data } = record;
  assert.equal(id, "legacy");
  assert.throws(() => validateUser(data), /Email/);
});
test("read projects fields safely without leaking stored password or metadata", () => {
  assert.deepEqual(
    readUserRecord("test", {
      email: null,
      hoten: 123,
      hinhanh: {},
      matkhau: "old-sensitive-value",
      role: "admin",
    }),
    {
      id: "test",
      email: "",
      hoten: "",
      hinhanh: "",
      matkhau: DEMO_PASSWORD,
    },
  );
});
test("one legacy record does not prevent reading other records", () => {
  const records = [
    { email: "bad" },
    { email: "good@example.com", hoten: "Good" },
  ].map((data, i) => readUserRecord(String(i), data));
  assert.equal(records.length, 2);
  assert.equal(records[1].email, "good@example.com");
});
