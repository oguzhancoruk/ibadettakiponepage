import { selectedGameAnswer, isGameAnswerCorrect } from "./games";
test("word puzzles distinguish identical letters by index", () => {
  const q = { word: "ALLAH", letters: ["A", "L", "A", "H", "L"] };
  const answer = selectedGameAnswer(q, [0, 1, 4, 2, 3]);
  expect(answer).toBe("ALLAH");
  expect(isGameAnswerCorrect(q, answer)).toBe(true);
});
test("ordering sends ordered text, not UI indexes, to the scoring API", () => {
  const q = { steps: ["Niyet", "Eller"], shuffled: ["Eller", "Niyet"] };
  expect(selectedGameAnswer(q, [1, 0])).toEqual(["Niyet", "Eller"]);
  expect(isGameAnswerCorrect(q, selectedGameAnswer(q, [0, 1]))).toBe(false);
});
