import { getPreferences } from "../context/Preferences";
import { t } from "../context/Preferences";
import { useState } from "react";
import { FiCopy, FiPlus, FiUserMinus, FiUsers } from "react-icons/fi";
import { request } from "../services/api";
import { useRemote, useMutation } from "../hooks/useRemote";
import {
  PageHeading,
  Feedback,
  Person,
  Empty,
  StatsStrip,
} from "../components/community/Shared";
const relations = ["Eş", "Oğul", "Kız", "Anne", "Baba", "Kardeş", "Diğer"];
export default function Family() {
  const family = useRemote("/family/members", {
    method: "post",
    jwt: true,
    data: {},
  });
  const mutation = useMutation();
  const [memberName, setMemberName] = useState("");
  const [createdInvite, setCreatedInvite] = useState(null);
  const [relation, setRelation] = useState("Diğer");
  const [inviteCode, setInviteCode] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [selected, setSelected] = useState("");
  const [month, setMonth] = useState(() =>
    new Date().toLocaleDateString("sv-SE").slice(0, 7)
  );
  const [yearNumber, monthNumber] = month.split("-").map(Number);
  const stats = useRemote(selected && month ? "/family/member-stats" : null, {
    method: "post",
    jwt: true,
    data: {
      memberId: selected,
      year: yearNumber,
      month: monthNumber,
    },
  });
  const disabled =
    family.loading || Boolean(mutation.busy) || Boolean(family.error);
  const create = async (e) => {
    e.preventDefault();
    const result = await mutation.run(
      "create",
      () =>
        request("/family/create-invite", {
          method: "post",
          jwt: true,
          data: {
            relation,
            memberName: memberName.trim(),
          },
        }),
      "Davet kodun hazır. Kodu davet etmek istediğin kişiyle paylaşabilirsin."
    );
    if (result.ok) {
      setCreatedInvite(result.value);
      setMemberName("");
      family.refresh();
    }
  };
  const accept = async (e) => {
    e.preventDefault();
    const result = await mutation.run(
      "accept",
      () =>
        request("/family/accept-invite", {
          method: "post",
          jwt: true,
          data: {
            inviteCode: inviteCode.trim().toUpperCase(),
          },
        }),
      "Davet kabul edildi. Davet sahibi artık ibadet istatistiklerini görebilir."
    );
    if (result.ok) {
      setInviteCode("");
      setAccepted(false);
      family.refresh();
    }
  };
  const remove = async (member) => {
    if (
      !window.confirm(
        `${member.memberName} adlı kişiyi aile takibinden çıkarmak istiyor musun?`
      )
    )
      return;
    const result = await mutation.run(
      member._id,
      () =>
        request("/family/remove", {
          method: "post",
          jwt: true,
          data: {
            memberId: member.memberUserId,
          },
        }),
      "Aile bağlantısı kaldırıldı."
    );
    if (result.ok) {
      if (selected === member.memberUserId) setSelected("");
      family.refresh();
    }
  };
  const copy = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      mutation.setMessage("Davet kodu kopyalandı.");
    } catch {
      mutation.setMessage("Kodu seçerek kopyalayabilirsin.");
    }
  };
  const members = family.data?.members || [];
  const invites = family.data?.pendingInvites || [];
  const selectedName = members.find(
    (m) => m.memberUserId === selected
  )?.memberName;
  return (
    <>
      <PageHeading
        eyebrow={t("BİRLİKTE, KÜÇÜK ADIMLARLA")}
        title={t("Ailem")}
        description={t(
          "Davet et, birlikte takip et. Aynı aile kayıtların web’de de yanında."
        )}
      />
      <Feedback error={family.error} retry={family.refresh} />
      <Feedback error={mutation.error} message={mutation.message} />
      <div className="pt-community-columns">
        <div className="pt-community-stack">
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Aile üyelerim")}</h2>
              <span className="pt-tag">
                {t(
                  family.loading || family.error
                    ? "—"
                    : t("{v0} kişi", {
                        v0: members.length,
                      })
                )}
              </span>
            </div>
            {t(
              family.loading ? (
                <p role="status" className="pt-empty">
                  {t("Aile kayıtları yükleniyor…")}
                </p>
              ) : (
                !family.error && (
                  <>
                    {members.map((member) => (
                      <div className="pt-member-card" key={member._id}>
                        <Person
                          name={member.memberName}
                          detail={member.relation}
                        />
                        <div className="pt-actions">
                          <button
                            className="pt-button secondary"
                            disabled={disabled || !member.memberUserId}
                            onClick={() => setSelected(member.memberUserId)}
                          >
                            {t("İstatistikleri gör")}
                          </button>
                          <button
                            className="pt-icon-button pt-danger-icon"
                            aria-label={t("{v0} aileden çıkar", {
                              v0: member.memberName,
                            })}
                            disabled={disabled || !member.memberUserId}
                            onClick={() => remove(member)}
                          >
                            <FiUserMinus />
                          </button>
                        </div>
                      </div>
                    ))}
                    {!members.length && (
                      <Empty>
                        {t(
                          "Henüz takip ettiğin bir aile üyesi yok. Davet kodu oluşturarak başlayabilirsin."
                        )}
                      </Empty>
                    )}
                  </>
                )
              )
            )}
          </section>
          {selected && (
            <section
              className="pt-panel"
              aria-label={t("Aile üyesi istatistikleri")}
            >
              <div className="pt-section-heading">
                <h2>
                  {t(selectedName || "Aile üyesi")}
                  {t(" · Aylık özet")}
                </h2>
                <button
                  className="pt-text-button"
                  onClick={() => setSelected("")}
                >
                  {t("Kapat")}
                </button>
              </div>
              <label className="pt-field pt-month-field">
                {t("Dönem")}
                <input
                  type="month"
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </label>
              <Feedback error={stats.error} retry={stats.refresh} />
              {t(
                stats.loading ? (
                  <p className="pt-empty" role="status">
                    {t("İstatistikler yükleniyor…")}
                  </p>
                ) : (
                  stats.data && (
                    <>
                      <StatsStrip
                        items={[
                          ["Kılınan namaz", stats.data.prayers?.completed],
                          [
                            "Tamamlanma",
                            `${stats.data.prayers?.percentage ?? 0}%`,
                          ],
                          [
                            "Oruç",
                            t("{v0} gün", {
                              v0: stats.data.fasting?.total ?? 0,
                            }),
                          ],
                        ]}
                      />
                      <p className="pt-note">
                        {t("Bu özet, seçilen ayın tamamındaki")}
                        {t(" ")}
                        {t(stats.data.prayers?.total ?? "—")}
                        {t(" vakit üzerinden hesaplanır.")}
                      </p>
                    </>
                  )
                )
              )}
            </section>
          )}
          <section className="pt-panel">
            <div className="pt-section-heading">
              <h2>{t("Bekleyen davetler")}</h2>
              <FiUsers />
            </div>
            {!family.loading && !family.error && !invites.length && (
              <Empty>{t("Henüz bekleyen davetin yok.")}</Empty>
            )}
            {invites.map((invite) => (
              <div className="pt-invite-row" key={invite._id}>
                <div>
                  <strong>{t(invite.memberName || invite.relation)}</strong>
                  <span>
                    {t(invite.relation)}
                    {t(" · Son gün")}
                    {t(" ")}
                    {new Date(invite.expiresAt).toLocaleDateString(
                      getPreferences().language
                    )}
                  </span>
                  <code>{t(invite.inviteCode)}</code>
                </div>
                <button
                  className="pt-icon-button"
                  aria-label={t("{v0} kodunu kopyala", {
                    v0: invite.inviteCode,
                  })}
                  onClick={() => copy(invite.inviteCode)}
                >
                  <FiCopy />
                </button>
              </div>
            ))}
          </section>
        </div>
        <aside className="pt-community-stack">
          <section className="pt-panel">
            <p className="pt-eyebrow">{t("BİRLİKTE TAKİP ET")}</p>
            <h2 className="pt-card-title">{t("Davet oluştur")}</h2>
            <p className="pt-note">
              {t(
                "Davet kabul edildiğinde aile üyenin namaz ve oruç istatistiklerini görebilirsin. Kabul edilen üyeler ve geçerli davetler için toplam sınır 10 kişidir."
              )}
            </p>
            <form className="pt-form-stack" onSubmit={create}>
              <label className="pt-field">
                {t("İsim ")}
                <span className="pt-optional">{t("(isteğe bağlı)")}</span>
                <input
                  maxLength={70}
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder={t("Davet edeceğin kişinin adı")}
                />
              </label>
              <label className="pt-field">
                {t("Yakınlık")}
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                >
                  {relations.map((r) => (
                    <option key={r}>{t(r)}</option>
                  ))}
                </select>
              </label>
              <button
                className="pt-button"
                disabled={disabled || members.length + invites.length >= 10}
              >
                <FiPlus />
                {t(
                  mutation.busy === "create"
                    ? "Oluşturuluyor…"
                    : "Davet kodu oluştur"
                )}
              </button>
            </form>
            {createdInvite?.inviteCode && (
              <div
                className="pt-invite-row"
                aria-label={t("Oluşturulan davet")}
              >
                <div>
                  <strong>{t("Davet kodun")}</strong>
                  <code>{t(createdInvite.inviteCode)}</code>
                </div>
                <button
                  className="pt-icon-button"
                  aria-label={t("Yeni davet kodunu kopyala")}
                  onClick={() => copy(createdInvite.inviteCode)}
                >
                  <FiCopy />
                </button>
              </div>
            )}
          </section>
          <section className="pt-panel">
            <p className="pt-eyebrow">{t("BİR DAVETİN Mİ VAR?")}</p>
            <h2 className="pt-card-title">{t("Aile davetini kabul et")}</h2>
            <form className="pt-form-stack" onSubmit={accept}>
              <label className="pt-field">
                {t("Davet kodu")}
                <input
                  required
                  maxLength={16}
                  value={inviteCode}
                  placeholder={t("FAM-XXXXXX")}
                  autoCapitalize="characters"
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    setAccepted(false);
                  }}
                />
              </label>
              <label className="pt-consent">
                <input
                  type="checkbox"
                  required
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>
                  {t(
                    "Daveti kabul ettiğimde namaz ve oruç istatistiklerimin davet sahibi tarafından görüntülenebileceğini biliyorum."
                  )}
                </span>
              </label>
              <button
                className="pt-button secondary"
                disabled={disabled || !accepted || !inviteCode.trim()}
              >
                {t(
                  mutation.busy === "accept"
                    ? "Kabul ediliyor…"
                    : "Daveti kabul et"
                )}
              </button>
            </form>
          </section>
        </aside>
      </div>
    </>
  );
}
