import { t } from "../context/Preferences";
import { useState } from "react";
import {
  FiSearch,
  FiUserPlus,
  FiCheck,
  FiX,
  FiUserMinus,
  FiShield,
  FiAward,
} from "react-icons/fi";
import { request } from "../services/api";
import { useRemote, useMutation } from "../hooks/useRemote";
import {
  PageHeading,
  Feedback,
  Person,
  Empty,
} from "../components/community/Shared";
export default function Friends() {
  const friends = useRemote("/friends");
  const incoming = useRemote("/friends/requests");
  const blocked = useRemote("/friends/blocked");
  const mutation = useMutation();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [sent, setSent] = useState([]);
  const [period, setPeriod] = useState("weekly");
  const escaped = submitted.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const search = useRemote(submitted ? "/friends/search" : null, {
    params: {
      q: escaped,
    },
  });
  const leaderboard = useRemote("/leaderboard", {
    params: {
      period,
    },
  });
  const ready = !friends.loading && !friends.error && !mutation.busy;
  const send = async (user) => {
    const result = await mutation.run(
      user._id,
      () =>
        request("/friends/request", {
          method: "post",
          data: {
            recipientId: user._id,
          },
        }),
      `${user.name} için arkadaşlık isteği gönderildi.`
    );
    if (result.ok) setSent((old) => [...old, user._id]);
  };
  const respond = async (item, action) => {
    const result = await mutation.run(
      item._id,
      () =>
        request(`/friends/respond/${item._id}`, {
          method: "post",
          data: {
            action,
          },
        }),
      action === "accept"
        ? "Arkadaşlık isteği kabul edildi."
        : "Arkadaşlık isteği reddedildi."
    );
    if (result.ok) {
      incoming.refresh();
      friends.refresh();
      leaderboard.refresh();
    }
  };
  const change = async (friend, action) => {
    const name = friend.user?.name || "Bu kullanıcı";
    const question =
      action === "block"
        ? `${name} adlı kişiyi engellemek istiyor musun?`
        : action === "unblock"
        ? `${name} ile engel kaydını kaldırmak istiyor musun? Yeniden arkadaş olmak için yeni istek gerekir.`
        : `${name} adlı kişiyi arkadaşlarından çıkarmak istiyor musun?`;
    if (!window.confirm(question)) return;
    const result = await mutation.run(
      friend.friendshipId,
      () =>
        request(
          action === "block"
            ? `/friends/block/${friend.friendshipId}`
            : `/friends/${friend.friendshipId}`,
          {
            method: action === "block" ? "post" : "delete",
            data: action === "block" ? {} : undefined,
          }
        ),
      action === "block"
        ? "Kullanıcı engellendi."
        : action === "unblock"
        ? "Engel kaydı kaldırıldı."
        : "Arkadaşlık kaldırıldı."
    );
    if (result.ok) {
      friends.refresh();
      blocked.refresh();
      leaderboard.refresh();
      search.refresh();
    }
  };
  return (
    <>
      <PageHeading
        eyebrow={t("BİRLİKTE İLERLEMEK GÜZEL")}
        title={t("Arkadaşlarım")}
        description={t(
          "Arkadaşlarını bul, isteklerini yönet ve birbirinizin ilerlemesine eşlik et."
        )}
      />
      <Feedback error={mutation.error} message={mutation.message} />
      <div className="pt-community-columns">
        <div className="pt-community-stack">
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Arkadaşlarım")}</h2>
              <span className="pt-tag">
                {t(
                  friends.loading || friends.error
                    ? "—"
                    : t("{v0} kişi", {
                        v0: friends.data?.length || 0,
                      })
                )}
              </span>
            </div>
            <Feedback error={friends.error} retry={friends.refresh} />
            {t(
              friends.loading ? (
                <p className="pt-empty" role="status">
                  {t("Arkadaşların yükleniyor…")}
                </p>
              ) : (
                !friends.error && (
                  <>
                    {!friends.data?.length && (
                      <Empty>
                        {t(
                          "Henüz arkadaşın yok. İsimle arama yaparak bir arkadaşlık isteği gönderebilirsin."
                        )}
                      </Empty>
                    )}
                    {t(
                      friends.data?.map((friend) => (
                        <div
                          className="pt-member-card"
                          key={friend.friendshipId}
                        >
                          <Person
                            name={friend.user?.name}
                            detail={`Seviye ${friend.user?.level ?? 1} · ${
                              friend.user?.totalXP ?? 0
                            } XP`}
                          />
                          <div className="pt-friend-meta">
                            <span>
                              <FiAward />{" "}
                              {t(friend.user?.achievementCount ?? 0)}
                              {t(" rozet")}
                            </span>
                            <span>
                              {t(friend.user?.currentStreak ?? 0)}
                              {t(" günlük seri")}
                            </span>
                          </div>
                          <div className="pt-actions">
                            <button
                              className="pt-button secondary"
                              disabled={!ready}
                              onClick={() => change(friend, "remove")}
                            >
                              <FiUserMinus />
                              {t("Arkadaşlıktan çıkar")}
                            </button>
                            <button
                              className="pt-text-button danger"
                              disabled={!ready}
                              onClick={() => change(friend, "block")}
                            >
                              <FiShield />
                              {t("Engelle")}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )
              )
            )}
          </section>
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Gelen istekler")}</h2>
              <FiUserPlus />
            </div>
            <Feedback error={incoming.error} retry={incoming.refresh} />
            {t(
              incoming.loading ? (
                <p className="pt-empty" role="status">
                  {t("İstekler yükleniyor…")}
                </p>
              ) : (
                !incoming.error && (
                  <>
                    {!incoming.data?.length && (
                      <Empty>{t("Bekleyen arkadaşlık isteğin yok.")}</Empty>
                    )}
                    {t(
                      incoming.data?.map((item) => (
                        <div className="pt-member-card" key={item._id}>
                          <Person
                            name={item.requester?.name}
                            detail={`Seviye ${item.requester?.level ?? 1}`}
                          />
                          <div className="pt-actions">
                            <button
                              className="pt-button"
                              disabled={Boolean(mutation.busy)}
                              onClick={() => respond(item, "accept")}
                            >
                              <FiCheck />
                              {t("Kabul et")}
                            </button>
                            <button
                              className="pt-button secondary"
                              disabled={Boolean(mutation.busy)}
                              onClick={() => respond(item, "reject")}
                            >
                              <FiX />
                              {t("Reddet")}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </>
                )
              )
            )}
          </section>
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Arkadaş sıralaması")}</h2>
              <FiAward />
            </div>
            <label className="pt-field pt-month-field">
              {t("Dönem")}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="weekly">{t("Bu hafta")}</option>
                <option value="monthly">{t("Bu ay")}</option>
                <option value="allTime">{t("Tüm zamanlar")}</option>
              </select>
            </label>
            <Feedback error={leaderboard.error} retry={leaderboard.refresh} />
            {t(
              leaderboard.loading ? (
                <p className="pt-empty" role="status">
                  {t("Sıralama yükleniyor…")}
                </p>
              ) : (
                !leaderboard.error && (
                  <>
                    {!leaderboard.data?.length && (
                      <Empty>{t("Henüz sıralama kaydı bulunmuyor.")}</Empty>
                    )}
                    <ol className="pt-leaderboard">
                      {t(
                        leaderboard.data?.map((item) => (
                          <li
                            key={item.userId}
                            className={item.isCurrentUser ? "is-me" : ""}
                          >
                            <span>{t(item.rank)}</span>
                            <div>
                              <strong>
                                {t(item.name)}
                                {t(item.isCurrentUser ? " · Sen" : "")}
                              </strong>
                              <small>
                                {t("Seviye ")}
                                {t(item.level)}
                              </small>
                            </div>
                            <b>
                              {t(item.xp ?? 0)} <small>{t("XP")}</small>
                            </b>
                          </li>
                        ))
                      )}
                    </ol>
                  </>
                )
              )
            )}
          </section>
        </div>
        <aside className="pt-community-stack">
          <section className="pt-panel">
            <p className="pt-eyebrow">{t("YOLCULUĞUNA EŞLİK ETSİN")}</p>
            <h2 className="pt-card-title">{t("Arkadaş bul")}</h2>
            <form
              className="pt-search-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim().length >= 2) {
                  setSubmitted(query.trim());
                  search.refresh();
                }
              }}
            >
              <label className="pt-field">
                {t("İsimle ara")}
                <input
                  required
                  minLength={2}
                  maxLength={60}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("En az 2 karakter")}
                />
              </label>
              <button
                className="pt-button"
                disabled={
                  search.loading ||
                  Boolean(mutation.busy) ||
                  query.trim().length < 2
                }
              >
                <FiSearch />
                {t("Ara")}
              </button>
            </form>
            <Feedback error={search.error} retry={search.refresh} />
            {submitted && (
              <p className="pt-note">
                “{t(submitted)}
                {t("” için arama sonuçları")}
              </p>
            )}
            {t(
              search.loading ? (
                <p className="pt-empty" role="status">
                  {t("Aranıyor…")}
                </p>
              ) : (
                submitted && !search.error && (
                  <>
                    {!search.data?.length && (
                      <Empty>
                        {t(
                          "Yeni bir kullanıcı bulunamadı. Mevcut arkadaşlar ve bekleyen istekler sonuçlarda gösterilmez."
                        )}
                      </Empty>
                    )}
                    {t(
                      search.data?.map((user) => (
                        <div className="pt-search-person" key={user._id}>
                          <Person
                            name={user.name}
                            detail={`Seviye ${user.level ?? 1}`}
                          />
                          <button
                            className="pt-button secondary"
                            disabled={
                              Boolean(mutation.busy) || sent.includes(user._id)
                            }
                            onClick={() => send(user)}
                          >
                            <FiUserPlus />
                            {t(
                              sent.includes(user._id)
                                ? "İstek gönderildi"
                                : "İstek gönder"
                            )}
                          </button>
                        </div>
                      ))
                    )}
                  </>
                )
              )
            )}
          </section>
          <section className="pt-panel">
            <h2 className="pt-card-title">{t("Engellenen kişiler")}</h2>
            <Feedback error={blocked.error} retry={blocked.refresh} />
            {t(
              blocked.loading ? (
                <p className="pt-empty" role="status">
                  {t("Yükleniyor…")}
                </p>
              ) : (
                !blocked.error && (
                  <>
                    {!blocked.data?.length && (
                      <Empty>{t("Engellenen kişi bulunmuyor.")}</Empty>
                    )}
                    {t(
                      blocked.data?.map((friend) => (
                        <div
                          className="pt-search-person"
                          key={friend.friendshipId}
                        >
                          <Person name={friend.user?.name} />
                          <button
                            className="pt-text-button"
                            disabled={Boolean(mutation.busy)}
                            onClick={() => change(friend, "unblock")}
                          >
                            {t("Engel kaydını kaldır")}
                          </button>
                        </div>
                      ))
                    )}
                  </>
                )
              )
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
