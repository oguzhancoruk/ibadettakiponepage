import { usePreferences, t } from "../context/Preferences";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiX,
  FiRotateCcw,
  FiAward,
  FiPlay,
} from "react-icons/fi";
import { request } from "../services/api";
import { useMutation } from "../hooks/useRemote";
import { Feedback } from "../components/community/Shared";
import {
  GAME_TYPES,
  GAME_BADGES,
  selectedGameAnswer,
  isGameAnswerCorrect,
} from "../utils/games";
export default function Game() {
  const { language } = usePreferences();
  const { gameKey } = useParams();
  const definition = GAME_TYPES[gameKey];
  const [session, setSession] = useState(null);
  const [difficulty, setDifficulty] = useState("mixed");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selection, setSelection] = useState(null);
  const [checked, setChecked] = useState(false);
  const [validation, setValidation] = useState("");
  const [result, setResult] = useState(null);
  const [newBadges, setNewBadges] = useState([]);
  const mutation = useMutation();
  const question = session?.questions?.[index];
  const busy = Boolean(mutation.busy);
  if (!definition)
    return (
      <section className="pt-panel">
        <h1>{t("Oyun bulunamadı")}</h1>
        <Link className="pt-back-link" to="/games">
          <FiArrowLeft />
          {t("Oyun merkezine dön")}
        </Link>
      </section>
    );
  const start = async () => {
    const next = await mutation.run("start", () =>
      request(`/games/${gameKey}/session`, {
        method: "post",
        jwt: true,
        raw: true,
        data: {
          language,
          ...(gameKey === "dailyQuiz"
            ? {
                difficulty,
              }
            : {}),
        },
      })
    );
    if (next.ok) {
      setSession(next.value);
      setResult(next.value.result || null);
      setIndex(0);
      setAnswers([]);
      setSelection(null);
      setChecked(false);
      setValidation("");
    }
  };
  const choose = (value) => {
    if (busy || checked) return;
    setSelection(value);
    setValidation("");
  };
  const add = (index) => {
    if (busy || checked) return;
    const previous = Array.isArray(selection) ? selection : [];
    if (previous.includes(index)) return;
    choose([...previous, index]);
  };
  const check = () => {
    const answer = selectedGameAnswer(question, selection);
    if (
      (question.word !== undefined || question.steps) &&
      !isGameAnswerCorrect(question, answer)
    ) {
      setValidation(
        question.word !== undefined
          ? "Harfleri yeniden gözden geçir. Bir harfi kaldırıp tekrar deneyebilirsin."
          : "Sıralamayı yeniden gözden geçir. Adımları kaldırıp tekrar yerleştirebilirsin."
      );
      return;
    }
    setChecked(true);
    setValidation("");
  };
  const advance = async () => {
    if (!checked || busy) return;
    const answer = selectedGameAnswer(question, selection);
    if (index < session.questions.length - 1) {
      setAnswers((old) => [...old, answer]);
      setIndex((old) => old + 1);
      setSelection(null);
      setChecked(false);
      setValidation("");
      return;
    }
    const outcome = await mutation.run("finish", () =>
      request(`/games/sessions/${session.sessionId}/complete`, {
        method: "post",
        jwt: true,
        raw: true,
        data: {
          answers: [...answers, answer],
        },
      })
    );
    if (outcome.ok) {
      setResult(outcome.value.result);
      setNewBadges(outcome.value.newlyUnlocked || []);
    }
  };
  const correct =
    question && checked
      ? isGameAnswerCorrect(question, selectedGameAnswer(question, selection))
      : null;
  const selected = Array.isArray(selection) ? selection : [];
  const selectionComplete =
    question &&
    (question.word !== undefined
      ? selected.length === Array.from(question.word).length
      : question.steps
      ? selected.length === question.steps.length
      : Number.isInteger(selection));
  return (
    <div className="pt-game-play">
      <Link className="pt-back-link" to="/games">
        <FiArrowLeft />
        {t("Oyun merkezi")}
      </Link>
      <div className="pt-page-heading">
        <div>
          <p className="pt-eyebrow">{t(definition.label)}</p>
          <h1>{t(definition.title)}</h1>
        </div>
      </div>
      <Feedback error={mutation.error} />
      {t(
        result ? (
          <section className="pt-panel pt-game-result">
            <span className="pt-result-trophy">
              <FiAward />
            </span>
            <p className="pt-eyebrow">{t("GÜZEL BİR BİLGİ MOLASIYDI")}</p>
            <h2>{t("Bugünkü oyun tamamlandı!")}</h2>
            <strong>
              {t(result.correctCount)}{" "}
              <span>
                / {t(result.questionCount)}
                {t(" doğru")}
              </span>
            </strong>
            <span className="pt-result-points">
              +{t(result.earnedPoints)}
              {t(" puan")}
            </span>
            <p>
              {t(
                "Sonucun hesabına kaydedildi. Yeni oyun puanı için yarın tekrar gelebilirsin."
              )}
            </p>
            {newBadges.length > 0 && (
              <div className="pt-new-badges">
                <h3>{t("Yeni rozetlerin")}</h3>
                {newBadges.map((key) => (
                  <span key={key}>
                    <FiAward />
                    {t(GAME_BADGES[key]?.name || key)}
                  </span>
                ))}
              </div>
            )}
            <Link className="pt-button" to="/games">
              {t("Oyun merkezine dön")}
              <FiArrowRight />
            </Link>
          </section>
        ) : !session ? (
          <section className="pt-panel pt-game-start">
            <span className={`pt-game-icon ${gameKey}`}>
              <FiPlay />
            </span>
            <h2>{t(definition.title)}</h2>
            <p>{t(definition.description)}</p>
            {gameKey === "dailyQuiz" && (
              <label className="pt-field">
                {t("Zorluk")}
                <select
                  value={difficulty}
                  disabled={busy}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="mixed">{t("Karışık")}</option>
                  <option value="easy">{t("Kolay")}</option>
                  <option value="medium">{t("Orta")}</option>
                  <option value="hard">{t("Zor")}</option>
                </select>
              </label>
            )}
            <button className="pt-button" disabled={busy} onClick={start}>
              {t(busy ? "Sorular yükleniyor…" : "Oyuna başla")}
              <FiArrowRight />
            </button>
            <p className="pt-note">
              {t(
                "Sonuçlar hesabına kaydedilir. Aynı oyundan günde bir kez puan kazanabilirsin."
              )}
            </p>
          </section>
        ) : !question ? (
          <section className="pt-panel">
            <p className="pt-error" role="alert">
              {t("Bu oturumda soru bulunamadı.")}
            </p>
            <button className="pt-button" disabled={busy} onClick={start}>
              {t("Yeniden yükle")}
            </button>
          </section>
        ) : (
          <section className="pt-panel pt-question-panel">
            <div className="pt-question-top">
              <span>
                {t("Soru ")}
                {t(index + 1)} / {t(session.questions.length)}
              </span>
              <span>{t(session.dateKey?.split("-").reverse().join("."))}</span>
            </div>
            <progress
              max={session.questions.length}
              value={index}
              aria-label={t("Oyun ilerlemesi")}
            />
            <h2>{t(question.question || question.text)}</h2>
            {t(
              question.word !== undefined ? (
                <>
                  <p className="pt-note">
                    {t(
                      "Harfleri sırayla seç. Seçtiğin bir harfe dokunarak geri alabilirsin."
                    )}
                  </p>
                  <div
                    className="pt-letter-answer"
                    aria-label={t("Seçilen harfler")}
                  >
                    {Array.from(question.word).map((_, position) => (
                      <button
                        key={position}
                        disabled={
                          busy || checked || selected[position] === undefined
                        }
                        aria-label={t("{v0}. harfi kaldır", {
                          v0: position + 1,
                        })}
                        onClick={() =>
                          choose(selected.filter((_, i) => i !== position))
                        }
                      >
                        {t(
                          selected[position] === undefined
                            ? ""
                            : question.letters[selected[position]]
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="pt-letter-options">
                    {question.letters.map((letter, letterIndex) => (
                      <button
                        key={letterIndex}
                        aria-label={t("{v0} harfini seç {v1}", {
                          v0: letter,
                          v1: letterIndex + 1,
                        })}
                        disabled={
                          busy || checked || selected.includes(letterIndex)
                        }
                        onClick={() => add(letterIndex)}
                      >
                        {t(letter)}
                      </button>
                    ))}
                  </div>
                </>
              ) : question.steps ? (
                <>
                  <p className="pt-note">
                    {t(
                      "Adımları doğru sırayla seç. Seçtiğin bir adımı kaldırarak düzenleyebilirsin."
                    )}
                  </p>
                  <ol
                    className="pt-order-answer"
                    aria-label={t("Seçilen sıralama")}
                  >
                    {selected.map((stepIndex, position) => (
                      <li key={stepIndex}>
                        <button
                          disabled={busy || checked}
                          onClick={() =>
                            choose(selected.filter((_, i) => i !== position))
                          }
                        >
                          <b>{t(position + 1)}</b>
                          {t(question.shuffled[stepIndex])}
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ol>
                  <div className="pt-order-options">
                    {question.shuffled.map((step, stepIndex) => (
                      <button
                        key={stepIndex}
                        disabled={
                          busy || checked || selected.includes(stepIndex)
                        }
                        onClick={() => add(stepIndex)}
                      >
                        {t(step)}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  className="pt-quiz-options"
                  role="group"
                  aria-label={t("Yanıt seçenekleri")}
                >
                  {t(
                    question.options?.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        aria-pressed={selection === optionIndex}
                        disabled={busy || checked}
                        className={
                          checked &&
                          optionIndex ===
                            (question.correctIndex ?? question.answer)
                            ? "is-correct"
                            : checked && selection === optionIndex && !correct
                            ? "is-wrong"
                            : ""
                        }
                        onClick={() => choose(optionIndex)}
                      >
                        <span>{t(String.fromCharCode(65 + optionIndex))}</span>
                        {t(option)}
                        {checked &&
                          optionIndex ===
                            (question.correctIndex ?? question.answer) && (
                            <FiCheck />
                          )}
                      </button>
                    ))
                  )}
                </div>
              )
            )}
            {validation && (
              <div className="pt-error" role="alert">
                {t(validation)}
              </div>
            )}
            {checked && (
              <div
                className={`pt-answer-feedback ${
                  correct ? "correct" : "wrong"
                }`}
                role="status"
              >
                <strong>
                  {t(
                    correct ? (
                      <>
                        <FiCheck />
                        {t("Doğru yanıt!")}
                      </>
                    ) : (
                      <>
                        <FiX />
                        {t("Bu kez olmadı.")}
                      </>
                    )
                  )}
                </strong>
                {question.explanation && <p>{t(question.explanation)}</p>}
                {question.source && (
                  <small>
                    {t("Kaynak: ")}
                    {t(question.source)}
                  </small>
                )}
              </div>
            )}
            <div className="pt-question-actions">
              {!checked && (question.word !== undefined || question.steps) && (
                <button
                  className="pt-button secondary"
                  disabled={busy || !selected.length}
                  onClick={() => choose([])}
                >
                  <FiRotateCcw />
                  {t("Temizle")}
                </button>
              )}
              {t(
                checked ? (
                  <button
                    className="pt-button"
                    disabled={busy}
                    onClick={advance}
                  >
                    {t(
                      busy
                        ? "Sonuç kaydediliyor…"
                        : index === session.questions.length - 1
                        ? "Sonucu kaydet"
                        : "Sonraki soru"
                    )}
                    <FiArrowRight />
                  </button>
                ) : (
                  <button
                    className="pt-button"
                    disabled={busy || !selectionComplete}
                    onClick={check}
                  >
                    {t("Yanıtı kontrol et")}
                    <FiCheck />
                  </button>
                )
              )}
            </div>
          </section>
        )
      )}
    </div>
  );
}
