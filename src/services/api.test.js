import axios from "axios";
import { request } from "./api";
jest.mock("axios", () => jest.fn());
beforeEach(() => {
  axios.mockReset();
  localStorage.setItem(
    "user",
    JSON.stringify({ _id: "user-id", token: "signed-token" })
  );
});
test("JWT endpoints use the signed token and retain raw game responses", async () => {
  const progress = { totalPoints: 245, history: {} };
  axios.mockResolvedValue({ data: progress });
  await expect(
    request("/games/progress", { jwt: true, raw: true })
  ).resolves.toEqual(progress);
  expect(axios).toHaveBeenCalledWith(
    expect.objectContaining({
      headers: { Authorization: "Bearer signed-token" },
    })
  );
});
test("legacy friend API keeps the account ID contract and unwraps status envelopes", async () => {
  axios.mockResolvedValue({
    data: { statusCode: 200, data: [{ name: "Ali" }] },
  });
  await expect(request("/friends")).resolves.toEqual([{ name: "Ali" }]);
  expect(axios).toHaveBeenCalledWith(
    expect.objectContaining({ headers: { Authorization: "Bearer user-id" } })
  );
});
test("a body-level failure is rejected even when HTTP succeeded", async () => {
  axios.mockResolvedValue({ data: { statusCode: 403, message: "Yetki yok" } });
  await expect(request("/family/members", { jwt: true })).rejects.toThrow(
    "Yetki yok"
  );
});
