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

const oldPrice = 249;
const currentPrice = 450;

const priceMilestones = [oldPrice, currentPrice, 457, 655, 990, 1395, 1999];
const paymentAddress = "TQjvmy6n1zpvNQ7daVmjALhe8gvQAVLrgY";
const supportTemplate = `Привіт! Оплатив доступ до MF Prime Club.
Сума: ${currentPrice} USDT (TRC20)
Хеш транзакції: ...
Мій нікнейм / контакт: ...`;
const closingHighlights = [
  "Приватний канал із повним потоком угод, аналітики та on-chain сигналів",
  "Закритий чат для питань, підтримки та розборів із MF та ядром комʼюніті",
  "Доступ до архіву кейсів, майбутніх запусків та дорожньої карти клубу"
];

export default function App() {
  const [activeLogo, setActiveLogo] = useState(0);
  const [isLuminous] = useState(true);
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
            Було{" "}
            <span className="price-old">{oldPrice}&nbsp;USDT</span>. Зараз{" "}
            <span className="price-new">{currentPrice}&nbsp;USDT</span>. З кожним новим кейсом і доданою цінністю ціна
            зростає. Зафіксуй вартість, поки вона доступна.
          </p>
          <div className="price-timeline" role="list">
            {priceMilestones.map((price, index) => {
              const isPast = price === oldPrice;
              const isCurrent = price === currentPrice;
              const isLast = index === priceMilestones.length - 1;

              let chipClass = "price-chip";
              if (isPast) chipClass += " price-chip-past";
              if (isCurrent) chipClass += " price-chip-current";
              if (isLast) chipClass += " price-chip-future";

              return (
                <div
                  key={price}
                  role="listitem"
                  className={chipClass}
                >
                  <span className="price-value">{price}</span>
                  <span className="price-label">USDT</span>
                  {isPast && <span className="price-hint">було</span>}
                  {isCurrent && <span className="price-hint">сьогодні</span>}
                  {isLast && <span className="price-hint">планова</span>}
                </div>
              );
            })}
          </div>
          <button className="primary-cta" type="button" onClick={() => scrollToSection("payment")}>
            Забрати доступ за{" "}
            <span className="price-new">{currentPrice}</span>{" "}
            USDT
          </button>
        </section>

        <section id="payment" className="scroll-section payment-section" aria-labelledby="payment-title">
          <h2 id="payment-title" className="section-title">
            Як оплатити доступ
          </h2>
          <div className="payment-panel">
            <div className="payment-summary">
              <p className="payment-amount">
                Сума до оплати →{" "}
                <span className="price-new">{currentPrice} USDT</span> (мережа TRC20)
              </p>
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
                <a
                  href="https://bingx.com/partner/mishafyk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="exchange-link"
                  title="Відкрити сторінку партнера BingX"
                >
                  <span className="exchange-icon" aria-hidden="true">
                    <img src="/bingx.svg" alt="" loading="lazy" />
                  </span>
                  <span className="exchange-text">
                    <span>Відкрити BingX</span>
                    <span>Партнерська сторінка Mishafyk</span>
                  </span>
                </a>
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
            Зафіксуй довічний доступ →{" "}
            <span className="price-new">{currentPrice}&nbsp;USDT</span> — після підтвердження оплати ти миттєво
            потрапляєш у канал і чат.
          </p>
          <ul className="closing-list" aria-label="Що відкривається після оплати">
            {closingHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="cta-actions">
            <button className="primary-cta" type="button" onClick={() => scrollToSection("payment")}>
              Оплатити{" "}
              <span className="price-new">{currentPrice}</span>{" "}
              USDT
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


