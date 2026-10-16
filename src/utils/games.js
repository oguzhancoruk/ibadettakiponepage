export const GAME_TYPES = {
  dailyQuiz: {
    title: "Günlük bilgi",
    label: "HER GÜN YENİ BİR SORU",
    description:
      "Kısa bir bilgi molası ver. Günün sorularını yanıtla, öğrendiklerini pekiştir.",
  },
  wordPuzzle: {
    title: "Kelime bulmaca",
    label: "HARFLERDEN ANLAMA",
    description: "İpucunu oku, harfleri seçerek doğru kelimeyi oluştur.",
  },
  ordering: {
    title: "Doğru sıralama",
    label: "ADIM ADIM ÖĞREN",
    description: "Verilen adımları doğru sıraya yerleştir.",
  },
};
export const GAME_BADGES = {
  first_quiz: {
    name: "İlk bilgi molası",
    description: "İlk günlük bilgi oyununu tamamla.",
  },
  perfect_day: {
    name: "Kusursuz gün",
    description: "Günlük bilgi oyununda tüm soruları doğru yanıtla.",
  },
  streak_3: {
    name: "Üç günlük istikrar",
    description: "Günlük bilgi oyununu üç gün üst üste tamamla.",
  },
  points_500: {
    name: "500 puan",
    description: "Oyunlarda toplam 500 puana ulaş.",
  },
};
export function selectedGameAnswer(question, selection) {
  if (!question) return null;
  if (question.word !== undefined)
    return selection.map((index) => question.letters[index]).join("");
  if (question.steps) return selection.map((index) => question.shuffled[index]);
  return selection;
}
export function isGameAnswerCorrect(question, answer) {
  if (question.word !== undefined) return answer === question.word;
  if (question.steps)
    return JSON.stringify(answer) === JSON.stringify(question.steps);
  return answer === (question.correctIndex ?? question.answer);
}
