import axios from "axios";
import config from "../config/config";
import { getSession } from "../utils/session";

export const request = async (
  path,
  { method = "get", params, data, jwt = false, raw = false, signal } = {}
) => {
  const user = getSession();
  const token = jwt ? user?.token : user?._id;
  if (jwt && !token)
    throw new Error("Bu özellik için yeniden giriş yapmanız gerekiyor.");
  const response = await axios({
    url: `${config.api_base}/api${path}`,
    method,
    params,
    data,
    signal,
    timeout: 20000,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const result = response.data;
  if (
    result?.statusCode &&
    (result.statusCode < 200 || result.statusCode >= 300)
  ) {
    throw new Error(
      result.message || "İşlem tamamlanamadı. Lütfen yeniden deneyin."
    );
  }
  return raw ? result : result?.data;
};

export const errorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Bağlantı kurulamadı. Lütfen yeniden deneyin.";
