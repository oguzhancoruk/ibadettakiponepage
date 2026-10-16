import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { act } from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Family from "./Family";
import Friends from "./Friends";
import Achievements from "./Achievements";
import Game from "./Game";
import { request } from "../services/api";

jest.mock("../services/api", () => ({
  request: jest.fn(),
  errorMessage: (e) => e.message,
}));
const show = (element) => render(<MemoryRouter>{element}</MemoryRouter>);
const showGame = (key) =>
  render(
    <MemoryRouter initialEntries={[`/games/${key}`]}>
      <Routes>
        <Route path="/games/:gameKey" element={<Game />} />
      </Routes>
    </MemoryRouter>
  );
const familyData = {
  members: [
    {
      _id: "relation-1",
      memberUserId: "member-1",
      memberName: "Zeynep",
      relation: "Kardeş",
    },
  ],
  pendingInvites: [],
};
beforeEach(() => {
  request.mockReset();
  request.mockResolvedValue(null);
});

test("family statistics use the member account ID and JWT for the selected month", async () => {
  request.mockImplementation((path) =>
    Promise.resolve(
      path === "/family/members"
        ? familyData
        : path === "/family/member-stats"
        ? {
            prayers: { completed: 24, total: 155, percentage: 15 },
            fasting: { total: 2 },
          }
        : null
    )
  );
  show(<Family />);
  fireEvent.click(
    await screen.findByRole("button", { name: "İstatistikleri gör" })
  );
  await screen.findByText("24");
  expect(request).toHaveBeenCalledWith(
    "/family/member-stats",
    expect.objectContaining({
      jwt: true,
      data: expect.objectContaining({ memberId: "member-1" }),
    })
  );
  await act(async () => {
    fireEvent.change(screen.getByLabelText("Dönem"), {
      target: { value: "2026-09" },
    });
  });
  await waitFor(() =>
    expect(request).toHaveBeenCalledWith(
      "/family/member-stats",
      expect.objectContaining({
        data: { memberId: "member-1", year: 2026, month: 9 },
      })
    )
  );
});

test("failed invitation creation preserves the entered name and shows no false success", async () => {
  request.mockImplementation((path) =>
    path === "/family/create-invite"
      ? Promise.reject(new Error("Davet limiti dolu"))
      : Promise.resolve({ members: [], pendingInvites: [] })
  );
  show(<Family />);
  const create = screen.getByRole("button", { name: "Davet kodu oluştur" });
  await waitFor(() => expect(create).toBeEnabled());
  fireEvent.change(screen.getByPlaceholderText("Davet edeceğin kişinin adı"), {
    target: { value: "Zeynep" },
  });
  fireEvent.click(create);
  fireEvent.click(create);
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Davet limiti dolu"
  );
  expect(screen.getByPlaceholderText("Davet edeceğin kişinin adı")).toHaveValue(
    "Zeynep"
  );
  expect(
    request.mock.calls.filter(([p]) => p === "/family/create-invite")
  ).toHaveLength(1);
  expect(screen.queryByText(/Davet kodun hazır/)).not.toBeInTheDocument();
});

test("accepting a family invitation requires the sharing acknowledgement", async () => {
  request.mockResolvedValue({ members: [], pendingInvites: [] });
  show(<Family />);
  fireEvent.change(screen.getByPlaceholderText("FAM-XXXXXX"), {
    target: { value: "fam-abcdef" },
  });
  const accept = screen.getByRole("button", { name: "Daveti kabul et" });
  expect(accept).toBeDisabled();
  fireEvent.click(screen.getByRole("checkbox"));
  await waitFor(() => expect(accept).toBeEnabled());
  await act(async () => {
    fireEvent.click(accept);
  });
  await screen.findByText(
    "Davet kabul edildi. Davet sahibi artık ibadet istatistiklerini görebilir."
  );
  expect(request).toHaveBeenCalledWith(
    "/family/accept-invite",
    expect.objectContaining({ jwt: true, data: { inviteCode: "FAM-ABCDEF" } })
  );
});

test("failed friend request remains retryable and is never marked as sent", async () => {
  request.mockImplementation((path) =>
    path === "/friends/search"
      ? Promise.resolve([{ _id: "friend-1", name: "Mehmet", level: 2 }])
      : path === "/friends/request"
      ? Promise.reject(new Error("İstek kaydedilemedi"))
      : Promise.resolve([])
  );
  show(<Friends />);
  fireEvent.change(screen.getByPlaceholderText("En az 2 karakter"), {
    target: { value: "Mehmet" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Ara" }));
  fireEvent.click(await screen.findByRole("button", { name: "İstek gönder" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "İstek kaydedilemedi"
  );
  expect(screen.getByRole("button", { name: "İstek gönder" })).toBeEnabled();
  expect(
    screen.queryByRole("button", { name: "İstek gönderildi" })
  ).not.toBeInTheDocument();
});

test("achievement filters retain server progress and distinguish locked from earned badges", async () => {
  request.mockResolvedValue({
    level: 2,
    totalXP: 300,
    currentXP: 50,
    nextLevelXP: 200,
    achievements: [
      {
        achievement: {
          _id: "a",
          title: "İlk adım",
          key: "first_step",
          category: "prayer",
          description: "İlk namaz kaydı",
          tier: "bronze",
          xp: 100,
        },
        unlocked: true,
        progress: 100,
      },
      {
        achievement: {
          _id: "b",
          title: "Zikir yolculuğu",
          key: "tasbih_master",
          category: "tesbih",
          description: "Tesbih hedefi",
          tier: "gold",
          xp: 200,
        },
        unlocked: false,
        progress: 40,
      },
    ],
  });
  show(<Achievements />);
  await screen.findByRole("heading", { name: "İlk adım" });
  fireEvent.change(screen.getByLabelText("Durum"), {
    target: { value: "locked" },
  });
  expect(
    screen.queryByRole("heading", { name: "İlk adım" })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole("progressbar", { name: "Zikir yolculuğu ilerlemesi" })
  ).toHaveValue(40);
  fireEvent.change(screen.getByLabelText("Kategori"), {
    target: { value: "prayer" },
  });
  expect(
    screen.getByText("Bu filtreye uygun rozet bulunmuyor.")
  ).toBeInTheDocument();
});

test("failed quiz completion retains the same session and answers for a safe retry", async () => {
  let completions = 0;
  request.mockImplementation((path) =>
    path.endsWith("/session")
      ? Promise.resolve({
          sessionId: "session-1",
          dateKey: "2026-10-15",
          questions: [
            { question: "Örnek soru", options: ["A", "B"], correctIndex: 0 },
          ],
        })
      : ++completions === 1
      ? Promise.reject(new Error("Kayıt başarısız"))
      : Promise.resolve({
          result: { correctCount: 1, questionCount: 1, earnedPoints: 45 },
          newlyUnlocked: [],
        })
  );
  showGame("dailyQuiz");
  fireEvent.click(screen.getByRole("button", { name: "Oyuna başla" }));
  const options = await screen.findByRole("group", {
    name: "Yanıt seçenekleri",
  });
  fireEvent.click(within(options).getAllByRole("button")[0]);
  fireEvent.click(screen.getByRole("button", { name: "Yanıtı kontrol et" }));
  fireEvent.click(screen.getByRole("button", { name: "Sonucu kaydet" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Kayıt başarısız");
  expect(
    screen.queryByRole("heading", { name: "Bugünkü oyun tamamlandı!" })
  ).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Sonucu kaydet" }));
  await screen.findByRole("heading", { name: "Bugünkü oyun tamamlandı!" });
  const calls = request.mock.calls.filter(([path]) =>
    path.includes("/complete")
  );
  expect(calls).toHaveLength(2);
  calls.forEach(([path, options]) => {
    expect(path).toBe("/games/sessions/session-1/complete");
    expect(options).toMatchObject({
      raw: true,
      jwt: true,
      data: { answers: [0] },
    });
  });
});

test("ordering rejects an incorrect sequence without sending a score", async () => {
  request.mockResolvedValue({
    sessionId: "ordering-1",
    questions: [
      {
        text: "Adımları sırala",
        steps: ["Bir", "İki"],
        shuffled: ["İki", "Bir"],
      },
    ],
  });
  showGame("ordering");
  fireEvent.click(screen.getByRole("button", { name: "Oyuna başla" }));
  fireEvent.click(await screen.findByRole("button", { name: "İki" }));
  fireEvent.click(screen.getByRole("button", { name: "Bir" }));
  fireEvent.click(screen.getByRole("button", { name: "Yanıtı kontrol et" }));
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Sıralamayı yeniden gözden geçir"
  );
  expect(request.mock.calls.some(([p]) => p.endsWith("/complete"))).toBe(false);
  fireEvent.click(screen.getByRole("button", { name: "Temizle" }));
  expect(
    screen.getByRole("button", { name: "Yanıtı kontrol et" })
  ).toBeDisabled();
});

test("a successfully created invite remains visible when refreshing the family list fails", async () => {
  let lists = 0;
  request.mockImplementation((path) => {
    if (path === "/family/members")
      return ++lists === 1
        ? Promise.resolve({ members: [], pendingInvites: [] })
        : Promise.reject(new Error("Liste yenilenemedi"));
    if (path === "/family/create-invite")
      return Promise.resolve({
        inviteCode: "FAM-ABCDEF",
        expiresAt: "2026-10-22",
      });
    return Promise.resolve(null);
  });
  show(<Family />);
  const create = screen.getByRole("button", { name: "Davet kodu oluştur" });
  await waitFor(() => expect(create).toBeEnabled());
  await act(async () => {
    fireEvent.click(create);
  });
  expect(await screen.findByText("FAM-ABCDEF")).toBeInTheDocument();
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Liste yenilenemedi"
  );
  expect(
    screen.getByRole("button", { name: "Yeni davet kodunu kopyala" })
  ).toBeInTheDocument();
});
