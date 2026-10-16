export const PRAYERS = [
  {
    key: "fajr",
    name: "Sabah",
    image: require("../assets/home/prayer-card-fajr-v2.png"),
  },
  {
    key: "dhuhr",
    name: "Öğle",
    image: require("../assets/home/prayer-card-dhuhr-v2.png"),
  },
  {
    key: "asr",
    name: "İkindi",
    image: require("../assets/home/prayer-card-asr-v2.png"),
  },
  {
    key: "maghrib",
    name: "Akşam",
    image: require("../assets/home/prayer-card-maghrib-v2.png"),
  },
  {
    key: "isha",
    name: "Yatsı",
    image: require("../assets/home/prayer-card-isha-v2.png"),
  },
];
export const NAFILE = [
  {
    key: "ishraq",
    name: "İşrak",
    time: "Güneş doğduktan sonra",
    rakats: [2, 4],
    image: require("../assets/home/nafile-ishraq.png"),
  },
  {
    key: "duha",
    name: "Duhâ",
    time: "Kuşluk vakti",
    rakats: [2, 4, 6, 8],
    image: require("../assets/home/nafile-duha.png"),
  },
  {
    key: "awwabin",
    name: "Evvabin",
    time: "Akşam namazından sonra",
    rakats: [6],
    image: require("../assets/home/nafile-awwabin.png"),
  },
  {
    key: "tahajjud",
    name: "Teheccüd",
    time: "Gece namazı",
    rakats: [2, 4, 8, 12],
    image: require("../assets/home/nafile-tahajjud.png"),
  },
];
export const dateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
export const emptyNafile = () =>
  Object.fromEntries(
    NAFILE.map(({ key }) => [key, { completed: false, rakats: 0 }])
  );
export const getNextPrayer = (days, now) => {
  const candidates = days.flatMap((day) =>
    PRAYERS.map((prayer) => {
      const time = day.times?.[prayer.key];
      if (!/^\d{2}:\d{2}$/.test(time || "")) return null;
      const at = new Date(`${day.date}T${time}:00`);
      return Number.isFinite(at.getTime()) && at > now
        ? { ...prayer, at, time }
        : null;
    }).filter(Boolean)
  );
  return candidates.sort((a, b) => a.at - b.at)[0] || null;
};
export const countdown = (seconds) => {
  const value = Math.max(0, Math.floor(seconds));
  return [Math.floor(value / 3600), Math.floor(value / 60) % 60, value % 60]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");
};
