import { getNextPrayer, dateKey, countdown } from "./prayers";
test("after the last prayer, countdown uses tomorrow’s real schedule", () => {
  const days = [
    { date: "2026-10-15", times: { isha: "20:00" } },
    { date: "2026-10-16", times: { fajr: "06:00" } },
  ];
  const next = getNextPrayer(days, new Date(2026, 9, 15, 23, 0));
  expect(next.key).toBe("fajr");
  expect(dateKey(next.at)).toBe("2026-10-16");
  expect(countdown((next.at - new Date(2026, 9, 15, 23, 0)) / 1000)).toBe(
    "07:00:00"
  );
});
test("missing and invalid prayer times never produce a fabricated countdown", () => {
  expect(
    getNextPrayer(
      [{ date: "2026-10-15", times: { fajr: null, isha: "not-a-time" } }],
      new Date(2026, 9, 15)
    )
  ).toBeNull();
});
test("negative countdown is clamped to zero", () =>
  expect(countdown(-1)).toBe("00:00:00"));
