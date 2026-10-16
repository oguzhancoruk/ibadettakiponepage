import {
  render,
  screen,
  waitFor,
  within,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { request } from "./services/api";

jest.mock("./services/api", () => ({
  request: jest.fn(),
  errorMessage: (error) => error.message,
}));
const user = {
  _id: "test-user",
  name: "Ayşe Demir",
  email: "test@example.com",
  token: "test-token",
};
const show = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>
  );
beforeEach(() => {
  localStorage.clear();
  request.mockReset();
  request.mockResolvedValue(null);
});

test("public site explains browser requirements for web notifications", () => {
  show("/features");
  expect(
    screen.getByRole("heading", { name: "Nafile namazlar" })
  ).toBeInTheDocument();
  expect(screen.getByText(/iPhone’da önce siteyi ana ekrana/)).toBeInTheDocument();
});

test("a corrupted local session redirects to login instead of crashing", () => {
  localStorage.setItem("user", "{broken");
  show("/dashboard");
  expect(screen.getByRole("textbox", { name: "E-posta" })).toBeInTheDocument();
});

test("account deletion requires password and explicit confirmation; failed deletion preserves login", async () => {
  localStorage.setItem("user", JSON.stringify(user));
  request.mockRejectedValue(new Error("Şifre yanlış."));
  show("/account");
  fireEvent.click(screen.getByRole("button", {name: "Hesap silme adımını aç"}));
  const remove = screen.getByRole("button", {name: "Hesabımı kalıcı olarak sil"});
  expect(remove).toBeDisabled();
  fireEvent.change(screen.getByLabelText("Mevcut şifren"), {target: {value: "incorrect"}});
  fireEvent.change(screen.getByLabelText("Onaylamak için SİL yaz"), {target: {value: "SİL"}});
  fireEvent.click(remove);
  await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Şifre yanlış."));
  expect(localStorage.getItem("user")).toBeTruthy();
});

test("mobile navigation exposes all primary screens and exploration tools", () => {
  localStorage.setItem("user", JSON.stringify(user));
  show("/tools");
  const mobile = screen.getByRole("navigation", { name: "Mobil menü" });
  expect(within(mobile).getAllByRole("link")).toHaveLength(5);
  expect(
    within(mobile).getByRole("link", { name: "Oruç takibi" })
  ).toHaveAttribute("href", "/fasting");
  expect(screen.getByRole("link", { name: /Kur’an ve hatim/ })).toHaveAttribute(
    "href",
    "/hatim"
  );
});

test("failed prayer loading disables editing and displays an error instead of zero progress", async () => {
  localStorage.setItem("user", JSON.stringify(user));
  request.mockImplementation((path) =>
    path === "/daily/prayer"
      ? Promise.reject(new Error("offline"))
      : Promise.resolve(null)
  );
  show("/dashboard");
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Bazı kayıtlar yüklenemedi"
    )
  );
  expect(
    screen.getByRole("button", { name: "Sabah namazı kılınmadı" })
  ).toBeDisabled();
  expect(screen.queryByText("0/5 tamamlandı")).not.toBeInTheDocument();
});

test("failed nafile save keeps the original completion status", async () => {
  localStorage.setItem("user", JSON.stringify(user));
  request.mockImplementation((path) =>
    path === "/nafile"
      ? Promise.reject(new Error("Kayıt başarısız"))
      : Promise.resolve(null)
  );
  show("/dashboard");
  const complete = screen.getByRole("button", { name: "İşrak tamamlandı" });
  await waitFor(() => expect(complete).toBeEnabled());
  fireEvent.click(complete);
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Kayıt başarısız")
  );
  expect(complete).toHaveAttribute("aria-pressed", "false");
});
