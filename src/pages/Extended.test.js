import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import Journal from "./Journal";
import Reports from "./Reports";
import Duas from "./Duas";
import { request } from "../services/api";
import { setPreferences } from "../context/Preferences";
import { normalizeReaderPreferences } from "../utils/quranReader";
jest.mock("../services/api", () => ({
  request: jest.fn(),
  errorMessage: (error) => error.message,
}));
const user = {
  _id: "local-test",
  token: "test-jwt",
  name: "Test Person",
  email: "local@example.invalid",
};
const show = (page) => render(<MemoryRouter>{page}</MemoryRouter>);
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("user", JSON.stringify(user));
  request.mockReset();
  request.mockResolvedValue(null);
  act(() => setPreferences({ language: "tr", theme: "light" }));
});
afterEach(() => act(() => setPreferences({ language: "tr", theme: "light" })));

test("a new journal day can be saved and a failed save retains the note", async () => {
  request.mockImplementation((path) =>
    path === "/mood/save"
      ? Promise.reject(new Error("Kayıt başarısız"))
      : Promise.resolve({ moods: [] })
  );
  show(<Journal />);
  await waitFor(() =>
    expect(screen.getByLabelText("Günlük notun")).toBeEnabled()
  );
  fireEvent.change(screen.getByLabelText("Günlük notun"), {
    target: { value: "Keep this note" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Günlüğümü kaydet" }));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Kayıt başarısız")
  );
  expect(screen.getByLabelText("Günlük notun")).toHaveValue("Keep this note");
  expect(request).toHaveBeenCalledWith(
    "/mood/save",
    expect.objectContaining({
      jwt: true,
      data: expect.objectContaining({
        journalEntry: "Keep this note",
        energyLevel: 3,
      }),
    })
  );
});
test("an unreadable journal disables saving instead of replacing an existing entry", async () => {
  request.mockRejectedValue(new Error("Bağlantı yok"));
  show(<Journal />);
  await screen.findAllByRole("alert");
  expect(screen.getByLabelText("Günlük notun")).toBeDisabled();
  expect(
    screen.getByRole("button", { name: "Günlüğümü kaydet" })
  ).toBeDisabled();
});
test("a failed report does not expose fabricated statistics or a printable empty report", async () => {
  request.mockRejectedValue(new Error("Rapor alınamadı"));
  show(<Reports />);
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Rapor alınamadı")
  );
  expect(screen.getByRole("button", { name: "PDF / Yazdır" })).toBeDisabled();
  expect(screen.queryByLabelText("İbadet raporu")).not.toBeInTheDocument();
});
test("yearly reports use signed authentication and the server-calculated totals", async () => {
  request.mockResolvedValue({
    year: 2026,
    prayer: {
      completed: 7,
      total: 100,
      byPrayer: { fajr: { completed: 3 } },
      byMonth: {},
    },
    completionPercentage: 7,
    tesbih: { totalCount: 33 },
    fasting: { total: 2 },
  });
  show(<Reports />);
  fireEvent.change(screen.getByLabelText("Dönem"), {
    target: { value: "yearly" },
  });
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      "/stats/yearly",
      expect.objectContaining({
        jwt: true,
        params: { year: new Date().getFullYear() },
      })
    )
  );
  await waitFor(() => expect(screen.getByText("7 / 100")).toBeInTheDocument());
});
test("favorites are scoped to the signed-in account and tolerate malformed saved preferences", async () => {
  localStorage.setItem(
    "pt:local-test:dua-favorites",
    JSON.stringify({ bad: true })
  );
  localStorage.setItem(
    "pt:other-user:dua-favorites",
    JSON.stringify(["someone-elses-dua"])
  );
  request.mockResolvedValue({
    duas: [
      {
        _id: "dua-1",
        title: "Test dua",
        content: "Test content",
        category: "genel",
      },
    ],
  });
  show(<Duas />);
  fireEvent.click(
    await screen.findByRole("button", { name: "Favorilerime ekle" })
  );
  expect(
    JSON.parse(localStorage.getItem("pt:local-test:dua-favorites"))
  ).toEqual(["dua-1"]);
  expect(
    JSON.parse(localStorage.getItem("pt:other-user:dua-favorites"))
  ).toEqual(["someone-elses-dua"]);
});
test("changing language and theme updates the application shell immediately", async () => {
  render(
    <MemoryRouter initialEntries={["/settings"]}>
      <App />
    </MemoryRouter>
  );
  fireEvent.change(screen.getByLabelText("Tema"), {
    target: { value: "dark" },
  });
  fireEvent.change(screen.getByLabelText("Dil"), { target: { value: "en" } });
  await waitFor(() =>
    expect(document.documentElement).toHaveAttribute("data-theme", "dark")
  );
  expect(
    screen.getByRole("heading", { name: "App settings" })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("navigation", { name: "Mobile menu" })
  ).toHaveTextContent("My prayers");
  expect(JSON.parse(localStorage.getItem("pt-preferences"))).toEqual({
    language: "en",
    theme: "dark",
  });
});
test("reader preferences reject out-of-range and duplicate bookmarks", () => {
  expect(
    normalizeReaderPreferences({
      lastPage: "606",
      bookmarks: [0, 1, "1", 605, 606, "2.5", "bad"],
      largeText: "yes",
    })
  ).toEqual({ lastPage: null, bookmarks: [1, 605], largeText: false });
});
test("successful deletion clears only the deleted account’s local data", async () => {
  request.mockResolvedValue(null);
  localStorage.setItem("pt:local-test:reader", "{}");
  localStorage.setItem("pt:other-user:reader", "{}");
  render(
    <MemoryRouter initialEntries={["/account"]}>
      <App />
    </MemoryRouter>
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Hesap silme adımını aç" })
  );
  fireEvent.change(screen.getByLabelText("Mevcut şifren"), {
    target: { value: "test-only-password" },
  });
  fireEvent.change(screen.getByLabelText("Onaylamak için SİL yaz"), {
    target: { value: "SİL" },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Hesabımı kalıcı olarak sil" })
  );
  await screen.findByRole("textbox", { name: "E-posta" });
  expect(localStorage.getItem("user")).toBeNull();
  expect(localStorage.getItem("pt:local-test:reader")).toBeNull();
  expect(localStorage.getItem("pt:other-user:reader")).toBe("{}");
});
