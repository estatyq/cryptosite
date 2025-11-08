import { useEffect, useRef, useState } from "react";
import FlowFieldCanvas from "./FlowFieldCanvas.jsx";

const logoThemes = [
  {
    src: "/1.png",
    accent: "#6ec2ff",
    accentRgb: [110, 194, 255],
    gradient:
      "radial-gradient(circle at 28% 25%, rgba(110, 194, 255, 0.4) 0%, rgba(9, 17, 32, 0) 60%)",
    softGlow: "rgba(110, 194, 255, 0.35)",
    strongGlow: "rgba(110, 194, 255, 0.65)"
  },
  {
    src: "/2.png",
    accent: "#f6d989",
    accentRgb: [246, 217, 137],
    gradient:
      "radial-gradient(circle at 70% 30%, rgba(246, 217, 137, 0.42) 0%, rgba(24, 18, 6, 0) 60%)",
    softGlow: "rgba(246, 217, 137, 0.35)",
    strongGlow: "rgba(246, 217, 137, 0.68)"
  },
  {
    src: "/3.png",
    accent: "#b38bff",
    accentRgb: [179, 139, 255],
    gradient:
      "radial-gradient(circle at 50% 70%, rgba(179, 139, 255, 0.42) 0%, rgba(21, 10, 38, 0) 62%)",
    softGlow: "rgba(179, 139, 255, 0.38)",
    strongGlow: "rgba(179, 139, 255, 0.7)"
  }
];

const accessHighlights = [
  "Мої особисті угоди: коли заходжу, де ставлю стоп/тейк та як супроводжую позицію",
  "Закритий чат однодумців без токсичності — говоримо по суті та скорочуємо шум",
  "Аналіз ринку й наративи: куди йде капітал і де зʼявляються нові можливості",
  "Особисті стратегії, які працюють зараз — без теорії заради теорії",
  "Інсайти з досвіду: помилки, що коштували грошей, аби ви їх не повторили",
  "Мотивація та дорожня карта: як стартувати, коли не знаєш, з чого почати"
];

const priceMilestones = [249, 457, 655, 990, 1395, 1999];
const paymentAddress = "TKB8LTG1HRpySZ3w6jjaGsvuqdZRt48hiv";
const supportTemplate = `Привіт! Оплатив доступ до MF Prime Club.
Сума: 249 USDT (TRC20)
Хеш транзакції: ...
Мій нікнейм / контакт: ...`;
const closingHighlights = [
  "Приватний канал із повним потоком угод, аналітики та on-chain сигналів",
  "Закритий чат для питань, підтримки та розборів із MF та ядром комʼюніті",
  "Доступ до архіву кейсів, майбутніх запусків та дорожньої карти клубу"
];

export default function App() {
  const [activeLogo, setActiveLogo] = useState(0);
  const [isLuminous, setIsLuminous] = useState(false);
  const [addressCopyLabel, setAddressCopyLabel] = useState("Копіювати адресу");
  const [templateCopyLabel, setTemplateCopyLabel] = useState("Скопіювати шаблон повідомлення");

  const copyTimers = useRef({ address: null, template: null });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveLogo((prev) => (prev + 1) % logoThemes.length);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [activeLogo]);

  useEffect(() => {
    return () => {
      Object.values(copyTimers.current).forEach((timerId) => {
        if (timerId) {
          window.clearTimeout(timerId);
        }
      });
    };
  }, []);

  const theme = logoThemes[activeLogo];
  const heroBenefits = [
    "Живі сесії з розбором угод та управління ризиками",
    "Закритий чат без випадкових людей і без шуму",
    "Доступ до нових наративів першої хвилі та запусків"
  ];

  const cardHighlights = [
    "Ексклюзивні угоди в реальному часі",
    "Інсайти з особистої практики",
    "Навігація по нових ринкових трендах"
  ];

  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleBrandKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToSection("top");
    }
  };

  const setCopyFeedback = (key, setter, defaultLabel, message) => {
    setter(message);
    if (copyTimers.current[key]) {
      window.clearTimeout(copyTimers.current[key]);
    }
    copyTimers.current[key] = window.setTimeout(() => setter(defaultLabel), 2800);
  };

  const copyValue = async (value, onSuccess, onError) => {
    try {
      await navigator.clipboard.writeText(value);
      onSuccess();
    } catch (error) {
      onError();
    }
  };

  const handleAddressCopy = () => {
    copyValue(
      paymentAddress,
      () => setCopyFeedback("address", setAddressCopyLabel, "Копіювати адресу", "Адресу скопійовано"),
      () => setCopyFeedback("address", setAddressCopyLabel, "Копіювати адресу", "Скопіюйте вручну")
    );
  };

  const handleTemplateCopy = () => {
    copyValue(
      supportTemplate,
      () =>
        setCopyFeedback(
          "template",
          setTemplateCopyLabel,
          "Скопіювати шаблон повідомлення",
          "Шаблон скопійовано"
        ),
      () =>
        setCopyFeedback(
          "template",
          setTemplateCopyLabel,
          "Скопіювати шаблон повідомлення",
          "Скопіюйте вручну"
        )
    );
  };

  const toggleLabel = "Світло";
  const toggleHint = "Ефект сяйва";

  return (
    <div className="page">
      <header className="site-header">
        <div
          className="brand"
          onClick={() => scrollToSection("top")}
          onKeyDown={handleBrandKeyDown}
          role="button"
          tabIndex={0}
        >
          <span className="brand-mark" aria-hidden="true">
            <img src="/2.png" alt="" />
          </span>
          <span className="brand-text">Prime Club</span>
        </div>
        <nav className="site-nav" aria-label="Основна навігація по секціях">
          <button type="button" onClick={() => scrollToSection("benefits")}>Що всередині</button>
          <button type="button" onClick={() => scrollToSection("pricing")}>Чому зараз</button>
          <button type="button" onClick={() => scrollToSection("payment")}>Оплата</button>
        </nav>
        <button className="site-header-cta" type="button" onClick={() => scrollToSection("payment")}>
          Приєднатися
        </button>
      </header>

      <FlowFieldCanvas accentRgb={theme.accentRgb} isLuminous={isLuminous} />

      <main className="page-content">
        <div className="layout hero-shell" id="top">
          <section className="hero-copy">
            <div className="hero-sequence" aria-label="Основний call-to-action">
              <h1 className="hero-title">MF PRIME CLUB</h1>
              <span className="hero-sequence-arrow" aria-hidden="true">
                ↓
              </span>
              <p className="hero-accent">Доступ назавжди</p>
              <span className="hero-sequence-arrow" aria-hidden="true">
                ↓
              </span>
              <div className="cta-group">
                <button className="cta-button" type="button" onClick={() => scrollToSection("payment")}>
                  <span className="cta-logo" aria-hidden="true">
                    <img src="/2.png" alt="" />
                  </span>
                  <span className="cta-text">
                    <span>Отримати доступ</span>
                    <span>Вступити до клубу</span>
                  </span>
                </button>
                <p className="hero-tagline">no risk — no porsche</p>
              </div>
            </div>
            <p className="hero-description">
              Закритий простір для трейдерів і фаундерів, де обмінюємося робочими стратегіями,
              підтримуємо один одного та фіксуємо можливості ще до того, як їх помічає ринок.
            </p>
            <ul className="hero-benefits" aria-label="Основні переваги">
              {heroBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </section>

          <aside
            className={`luminous-card ${isLuminous ? "is-lit" : ""}`}
            data-lit={isLuminous ? "on" : "off"}
            aria-live="polite"
          >
            <div className="logo-carousel" aria-hidden="true">
              {logoThemes.map((logo, index) => (
                <div
                  key={logo.src}
                  className={`logo-slide ${index === activeLogo ? "active" : ""}`}
                >
                  <div className="logo-backdrop" aria-hidden="true" />
                  <img
                    src={logo.src}
                    alt={`Логотип клубу — варіант ${index + 1}`}
                    className="logo-image"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <div className="card-divider" />

            <div>
              <p className="card-title">PREMIUM ACCESS</p>
              <p className="card-subtext">Закритий криптоклуб для обраних трейдерів.</p>
            </div>

            <div className="card-details">
              {cardHighlights.map((highlight) => (
                <span key={highlight}>{highlight}</span>
              ))}
            </div>

            <button
              className="toggle-control"
              type="button"
              aria-pressed={isLuminous}
              aria-label="Перемкнути підсвічування карти"
              onClick={() => setIsLuminous((value) => !value)}
            >
              <span className="toggle-thumb" aria-hidden="true" />
              <span className="toggle-label">{toggleLabel}</span>
              <span className="toggle-hint">{toggleHint}</span>
            </button>
          </aside>
        </div>

        <section id="benefits" className="scroll-section benefits-section" aria-labelledby="benefits-title">
          <h2 id="benefits-title" className="section-title">
            Що входить у MF Prime Club
          </h2>
          <p className="section-subtitle">
            Ви отримуєте не просто чат, а доступ до всієї операційної системи трейдингу, яку збирав MF.
          </p>
          <ul className="benefits-list">
            {accessHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section id="community" className="scroll-section key-section">
          <h2 className="section-title">🗝 MF Комʼюніті — ключ до твого успіху</h2>
          <p className="section-subtitle">
            Ти не залишаєшся наодинці з ринком. Учасники клубу діляться робочими кейсами, підтримують і допомагають
            рухатися швидше без зайвого шуму.
          </p>
        </section>

        <section id="pricing" className="scroll-section pricing-section" aria-labelledby="pricing-title">
          <h2 id="pricing-title" className="section-title">
            Чому варто приєднатися зараз
          </h2>
          <p className="section-subtitle">
            Сьогодні доступ коштує 249&nbsp;USDT. З кожним новим кейсом і доданою цінністю ціна зростає. Зафіксуй
            найнижчу вартість, поки вона доступна.
          </p>
          <div className="price-timeline" role="list">
            {priceMilestones.map((price, index) => {
              const isCurrent = index === 0;
              const isFuture = index === priceMilestones.length - 1;
              return (
                <div
                  key={price}
                  role="listitem"
                  className={`price-chip ${isCurrent ? "price-chip-current" : ""} ${
                    isFuture ? "price-chip-future" : ""
                  }`}
                >
                  <span className="price-value">{price}</span>
                  <span className="price-label">USDT</span>
                  {isCurrent && <span className="price-hint">сьогодні</span>}
                  {isFuture && <span className="price-hint">планова</span>}
                </div>
              );
            })}
          </div>
          <button className="primary-cta" type="button" onClick={() => scrollToSection("payment")}>
            Забрати доступ за 249 USDT
          </button>
        </section>

        <section id="payment" className="scroll-section payment-section" aria-labelledby="payment-title">
          <h2 id="payment-title" className="section-title">
            Як оплатити доступ
          </h2>
          <div className="payment-panel">
            <div className="payment-summary">
              <p className="payment-amount">Сума до оплати — 249 USDT (мережа TRC20)</p>
              <p className="payment-note">
                Перекази приймаються тільки на адресу нижче. Після оплати обовʼязково надішліть підтвердження
                в підтримку, щоб отримати доступ.
              </p>
            </div>
            <div className="payment-address-card">
              <code className="payment-address" aria-label="Адреса гаманця для оплати">
                {paymentAddress}
              </code>
              <div className="payment-actions">
                <button className="copy-button" type="button" onClick={handleAddressCopy}>
                  {addressCopyLabel}
                </button>
                <div className="wallet-links">
                  <a 
                    href={`https://link.trustwallet.com/send?asset=c195&address=${paymentAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wallet-link"
                    title="Відкрити в Trust Wallet"
                  >
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                      <path d="M16 0L4 6v10c0 7.732 5.227 14.965 12 16 6.773-1.035 12-8.268 12-16V6L16 0z" fill="#3375BB"/>
                    </svg>
                  </a>
                  <a 
                    href={`https://metamask.app.link/send/${paymentAddress}@195`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wallet-link"
                    title="Відкрити в MetaMask"
                  >
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                      <path d="M27.1 2.5l-10.3 7.6 1.9-4.5z" fill="#E17726"/>
                      <path d="M4.9 2.5l10.2 7.7-1.8-4.6zM23.3 21.8l-2.7 4.1 5.8 1.6 1.7-5.6zM3.9 21.9l1.6 5.6 5.8-1.6-2.7-4.1z" fill="#E27625"/>
                      <path d="M11 14.1l-1.6 2.4 5.7.3-.2-6.2zM21 14.1l-4-3.6-.1 6.3 5.7-.3zM11.3 25.9l3.5-1.7-3-2.3zM17.2 24.2l3.5 1.7-.5-4z" fill="#E27625"/>
                      <path d="M20.7 25.9l-3.5-1.7.3 2.3-.1.6zM11.3 25.9l3.3.6v-.6l.3-2.3z" fill="#D5BFB2"/>
                      <path d="M14.7 19.7l-2.9-.9 2-1zM17.3 19.7l.9-1.9 2.1 1z" fill="#233447"/>
                      <path d="M11.3 25.9l.5-4-3.3.1zM20.2 21.9l.5 4 2.8-3.9zM22.6 16.5l-5.7.3.5 2.9.9-1.9 2.1 1zM11.8 17.8l2.1-1 .9 1.9.5-2.9-5.7-.3z" fill="#CC6228"/>
                      <path d="M9.4 16.5l2.5 4.8-.1-2.4zM20.5 18.9l-.1 2.4 2.5-4.8zM15.2 16.8l-.5 2.9.6 3.2.1-3.9zM16.8 16.8l-.2 2.2.2 3.9.6-3.2z" fill="#E27525"/>
                      <path d="M17.3 19.7l-.6 3.2.4.3 3-2.3.1-2.4zM11.8 17.8l.1 2.4 3 2.3.4-.3-.6-3.2z" fill="#F5841F"/>
                      <path d="M17.4 26.5l.1-.6-.2-.2h-2.6l-.2.2.1.6-3.3-.6.9.8 2.4 1.6h2.7l2.4-1.6.9-.8z" fill="#C0AC9D"/>
                      <path d="M17.2 24.2l-.4-.3h-1.6l-.4.3-.3 2.3.2-.2h2.6l.2.2z" fill="#161616"/>
                      <path d="M27.6 10.6l.9-4.3L27.1 2.5l-9.9 7.4 3.8 3.2 5.4 1.6 1.2-1.4-.5-.4.8-.8-.6-.5.8-.6zM3.5 6.3l.9 4.3-.6.4.8.6-.6.5.8.8-.5.4 1.2 1.4 5.4-1.6 3.8-3.2L4.9 2.5z" fill="#763E1A"/>
                      <path d="M26.5 13.7l-5.4-1.6 1.6 2.4-2.5 4.8 3.3-.1h4.9zM10.9 12.1l-5.4 1.6-1.5 5.6h4.9l3.3.1-2.5-4.8zM16.8 16.8l.4-6.9 1.7-4.7h-7.8l1.7 4.7.4 6.9.1 2.2v3.9h1.6v-3.9z" fill="#F5841F"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="payment-support">
              <p>
                Після переказу надішли у підтримку скрін платежу та хеш-транзакцію. Щоб не забути деталі, скористайся
                готовим шаблоном.
              </p>
              <pre className="support-template" aria-label="Шаблон повідомлення для підтримки">
                {supportTemplate}
              </pre>
              <button className="copy-button" type="button" onClick={handleTemplateCopy}>
                {templateCopyLabel}
              </button>
            </div>
          </div>
        </section>

        <section id="cta" className="scroll-section closing-section">
          <h2 className="section-title">Готовий приєднатися до MF Prime Club?</h2>
          <p className="section-subtitle closing-lead">
            Зафіксуй довічний доступ за 249&nbsp;USDT — після підтвердження оплати ти миттєво потрапляєш у канал і чат.
          </p>
          <ul className="closing-list" aria-label="Що відкривається після оплати">
            {closingHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="cta-actions">
            <button className="primary-cta" type="button" onClick={() => scrollToSection("payment")}>
              Оплатити 249 USDT
            </button>
            <button className="ghost-cta" type="button" onClick={() => scrollToSection("benefits")}>
              Переглянути, що всередині
            </button>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <small>© 2025 MF Prime Club. Усі права захищено.</small>
      </footer>
    </div>
  );
}

 
