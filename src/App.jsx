import { useCallback, useEffect, useRef, useState } from "react";

const PRIZES = [
  { value: "500", label: "METICAIS" },
  { value: "BOA", label: "SORTE" },
  { value: "500", label: "METICAIS" },
  { value: "25.000", label: "METICAIS" },
  { value: "5.000", label: "METICAIS" },
  { value: "19.000", label: "METICAIS" },
  { value: "BOA", label: "SORTE" },
  { value: "3.000", label: "METICAIS" },
  { value: "8.000", label: "METICAIS" },
  { value: "1.000", label: "METICAIS" },
  { value: "10", label: "METICAIS" },
  { value: "100", label: "METICAIS" },
];

const BANKNOTES = [
  { src: "/images/nota.webp", left: 18, top: 4, width: 96, rotation: -4, z: 1 },
  { src: "/images/nota500.jpg", left: 74, top: 2, width: 88, rotation: 5, z: 1 },
  { src: "/images/nota200.jpg", left: 4, top: 34, width: 92, rotation: -8, z: 2 },
  { src: "/images/nota.webp", left: 38, top: 30, width: 118, rotation: 2, z: 3 },
  { src: "/images/nota200.jpg", left: 66, top: 38, width: 96, rotation: -3, z: 2 },
];

const SPIN_DURATION = 5000;
const SPIN_FALLBACK = 5300;
const AFFILIATE_URL = "https://abre.ai/os9z";

function pointAt(angle, radius) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return [
    Number((radius * Math.cos(radians)).toFixed(6)),
    Number((radius * Math.sin(radians)).toFixed(6)),
  ];
}

function Wheel({ rotation, spinning, onStop }) {
  return (
    <div className="game-wheel-wrap relative mx-auto mt-2 w-[min(100%,calc(100vh-370px))] max-w-[290px] min-w-[180px]">
      <svg
        viewBox="-150 -150 300 300"
        className="game-wheel wheel-glow w-full"
        aria-label="Roleta de prémios"
        role="img"
      >
        <defs>
          <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--rim-top)" />
            <stop offset="45%" stopColor="var(--rim-middle)" />
            <stop offset="100%" stopColor="var(--rim-bottom)" />
          </linearGradient>
          <radialGradient id="shade" cx="50%" cy="42%" r="62%">
            <stop offset="55%" stopColor="var(--wheel-transparent)" />
            <stop offset="100%" stopColor="var(--wheel-shade)" />
          </radialGradient>
          <radialGradient id="hub" cx="40%" cy="35%">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--gold-deep)" />
          </radialGradient>
          <radialGradient id="spark">
            <stop offset="0%" stopColor="var(--spark-center)" />
            <stop offset="45%" stopColor="var(--spark-middle)" />
            <stop offset="100%" stopColor="var(--wheel-transparent)" />
          </radialGradient>
        </defs>

        <circle r="144" fill="var(--rim-edge)" />
        <circle r="142" fill="url(#rim)" />
        <circle r="133" fill="var(--rim-bottom)" />
        <circle r="131" fill="var(--rim-inner)" />

        {Array.from({ length: 16 }, (_, index) => {
          const [x, y] = pointAt(index * 22.5, 137.5);
          return (
            <circle
              key={index}
              className={index % 2 ? "led-b" : "led-a"}
              cx={x}
              cy={y}
              r="3.3"
              fill="var(--spark-light)"
              stroke="var(--gold)"
              strokeWidth="1"
            />
          );
        })}

        <g
          data-wheel=""
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 1)`
              : "none",
          }}
          onTransitionEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.propertyName === "transform"
            ) {
              onStop();
            }
          }}
        >
          {PRIZES.map((prize, index) => {
            const start = index * 30;
            const [x1, y1] = pointAt(start, 120);
            const [x2, y2] = pointAt(start + 30, 120);
            const isGoodLuck = prize.value === "BOA";
            return (
              <g key={`${prize.value}-${index}`}>
                <path
                  d={`M0 0 L${x1} ${y1} A120 120 0 0 1 ${x2} ${y2} Z`}
                  fill={`var(--seg-${index + 1})`}
                  stroke="var(--segment-border)"
                  strokeWidth="1"
                />
                <g transform={`rotate(${start + 15})`}>
                  <text
                    y="-92"
                    textAnchor="middle"
                    fontWeight="900"
                    fontSize={isGoodLuck ? 16 : prize.value.length > 4 ? 14 : 17}
                    fill={index === 3 ? "var(--prize-ink)" : "white"}
                  >
                    {prize.value}
                  </text>
                  <text
                    y="-78"
                    textAnchor="middle"
                    fontWeight="800"
                    fontSize="6.5"
                    fill="white"
                  >
                    {prize.label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        <circle r="120" fill="url(#shade)" pointerEvents="none" />
        <g className="wheel-orbit">
          <circle cx="0" cy="-136.5" r="8" fill="url(#spark)" />
          <circle cx="0" cy="-136.5" r="3.4" fill="var(--spark-light)" />
        </g>
        <circle r="31" fill="var(--rim-bottom)" />
        <circle r="29" fill="url(#rim)" />
        <circle
          r="22"
          fill="url(#hub)"
          stroke="var(--gold-deep)"
          strokeWidth="1.5"
        />
        <ellipse
          cx="-6"
          cy="-10"
          rx="10"
          ry="6"
          fill="var(--hub-reflection)"
        />
      </svg>

      <svg
        viewBox="0 0 40 40"
        className="absolute right-[-10px] top-1/2 w-10 -translate-y-1/2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        aria-hidden="true"
      >
        <polygon
          points="0,20 40,4 40,36"
          fill="var(--pointer-fill)"
          stroke="var(--pointer-border)"
          strokeWidth="2"
        />
      </svg>
      <div className="wheel-base mx-auto -mt-3 h-5 w-[85%] rounded-[50%]" />
    </div>
  );
}

function ActivityStats() {
  const [seconds, setSeconds] = useState(119);
  const [people, setPeople] = useState(687);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setSeconds((current) => Math.max(0, current - 1));
      setPeople((current) =>
        Math.min(720, Math.max(600, current + Math.round(Math.random() * 16 - 8))),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const remainder = String(seconds % 60).padStart(2, "0");

  return (
    <div className="stats-box mt-3 flex items-center rounded-2xl px-2 py-2.5">
      <div className="flex flex-1 items-center justify-center gap-2">
        <span className="relative grid h-9 w-9 place-items-center rounded-full border-2 border-gold">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="var(--gold)" aria-hidden="true">
            <circle cx="9" cy="7" r="3.2" />
            <path d="M2.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6z" />
            <circle cx="17" cy="8" r="2.4" opacity="0.7" />
            <path
              d="M15.5 13.4c2.9-.4 6 1.6 6 5.6h-4.2c0-2.3-.7-4.2-1.8-5.6z"
              opacity="0.7"
            />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-mint" />
        </span>
        <div className="text-left">
          <div className="text-2xl leading-none font-black text-gold">{people}</div>
          <div className="mt-0.5 text-[9px] font-extrabold text-white-ish">
            PESSOAS ONLINE
          </div>
        </div>
      </div>
      <div className="h-9 w-px bg-gold/50" />
      <div className="flex flex-1 items-center justify-center gap-2">
        <span className="text-2xl" aria-hidden="true">
          ⏳
        </span>
        <div className="text-left">
          <div className="text-2xl leading-none font-black text-gold">
            {minutes}:{remainder}
          </div>
          <div className="mt-0.5 text-[9px] font-extrabold text-white-ish">
            TEMPO RESTANTE
          </div>
        </div>
      </div>
    </div>
  );
}

function MoneyFloor() {
  return (
    <div
      className="money-floor pointer-events-none relative mx-auto mt-2 h-[min(72px,calc(100vh-540px))] min-h-0 w-full overflow-hidden rounded-b-3xl"
      aria-hidden="true"
    >
      {BANKNOTES.map((note, index) => (
        <img
          key={index}
          src={note.src}
          width="150"
          height="60"
          decoding="async"
          loading="lazy"
          alt=""
          className="absolute rounded-sm object-cover shadow-[0_8px_14px_rgba(0,0,0,0.7)]"
          style={{
            left: `${note.left}%`,
            top: `${note.top}px`,
            width: `${note.width}px`,
            height: `${Math.round(note.width * 0.42)}px`,
            transform: `rotate(${note.rotation}deg)`,
            zIndex: note.z,
          }}
        />
      ))}
    </div>
  );
}

function PrizeModal({ onDismiss, onRegister }) {
  const confetti = Array.from({ length: 12 }, (_, index) => {
    const side = index % 2 === 0 ? "left" : "right";
    const position = `${3 + (index % 3) * 4}%`;
    return {
      index,
      style: {
        [side]: position,
        width: 86,
        height: 58,
        animationDuration: `${6 + (index % 4)}s`,
        animationDelay: `${-(index * 1.2)}s`,
      },
    };
  });

  return (
    <div
      className="modal-backdrop modal-backdrop--win fixed inset-0 grid place-items-center overflow-hidden overlay-dark px-5"
      role="presentation"
      onClick={onDismiss}
    >
      {confetti.map(({ index, style }) => (
        <div
          key={index}
          className="flag-fall pointer-events-none absolute top-0 overflow-hidden rounded-sm"
          style={style}
        >
          <img
            src="/images/bandeira.png"
            width="86"
            height="58"
            decoding="async"
            alt=""
            className="h-full w-full scale-[1.08] object-cover"
          />
        </div>
      ))}
      <div
        className="pop-in stats-box relative z-10 w-full max-w-sm rounded-3xl p-5 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="win-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="win-title" className="text-3xl font-black text-glow-gold">
          🎉 Vitória 🎉
        </h2>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-4xl" aria-hidden="true">
            🤑
          </span>
          <p className="flex-1 text-left text-base font-extrabold text-white-ish">
            Parabéns! Você ganhou
          </p>
          <p className="text-right text-2xl leading-tight font-black text-glow-gold">
            19.000
            <br />
            <span className="text-lg text-glow-gold">Meticais!</span>
          </p>
        </div>
        <p className="mt-4 text-sm font-bold text-white-ish">
          Para receber, registre-se na plataforma clicando no botão abaixo e{" "}
          <span className="text-alert">deposite 100mt ou 200mt</span> para que
          possamos confirmar seu número e enviar o valor.
        </p>
        <div className="mt-4 rounded-xl border-2 border-alert/70 bg-alert/10 p-3 text-left">
          <p className="text-center text-sm font-black tracking-[0.25em] text-glow-red">
            ⚠️ ATENÇÃO
          </p>
          <p className="mt-2 text-sm font-extrabold text-white-ish">
            É <span className="text-alert">necessário depositar</span> 100mt ou
            200mt para receber o prémio.{" "}
            <span className="text-glow-red">
              Sem o depósito o valor não é enviado.
            </span>
          </p>
        </div>
        <a
          href={AFFILIATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onRegister}
          className="affiliate-link btn-spin btn-float mt-5 flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-6 text-center text-xl font-black tracking-wide whitespace-nowrap"
        >
          💰 REGISTRE-SE AGORA!
        </a>
      </div>
    </div>
  );
}

function TryAgainModal({ onRetry }) {
  return (
    <div className="modal-backdrop fixed inset-0 grid place-items-center overflow-hidden overlay-dark px-5">
      {[3, 7, 11, 15].map((index) => (
        <div
          key={index}
          className="flag-fall pointer-events-none absolute top-0 overflow-hidden rounded-sm"
          style={{
            [index % 2 === 0 ? "left" : "right"]: `${3 + (index % 3) * 4}%`,
            width: 86,
            height: 58,
            animationDuration: `${6 + (index % 4)}s`,
            animationDelay: `${-(index * 1.2)}s`,
          }}
        >
          <img
            src="/images/bandeira.png"
            width="86"
            height="58"
            decoding="async"
            alt=""
            className="h-full w-full scale-[1.08] object-cover"
          />
        </div>
      ))}
      <div
        className="pop-in fail-card relative z-10 w-full max-w-xs rounded-3xl p-6 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="try-again-title"
      >
        <div className="fail-ring mx-auto grid h-20 w-20 place-items-center rounded-full">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10"
            fill="none"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </div>
        <p
          id="try-again-title"
          className="mt-5 text-2xl leading-tight font-black text-white-ish"
        >
          Ainda tem <span className="text-gold">1 tentativa gratuita</span>
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="btn-spin btn-blink mt-5 w-full rounded-xl py-3 text-lg font-black"
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [rotation, setRotation] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [modal, setModal] = useState(null);
  const [pageHidden, setPageHidden] = useState(false);
  const timeoutRef = useRef(null);
  const spinIndexRef = useRef(0);
  const finishedRef = useRef(true);
  const rotationRef = useRef(0);

  useEffect(() => {
    const updateVisibility = () => setPageHidden(document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const finishSpin = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    window.clearTimeout(timeoutRef.current);
    setSpinning(false);
    setAttempts((current) => current + 1);
    setModal(spinIndexRef.current === 0 ? "retry" : "prize");
  }, []);

  const spin = useCallback(() => {
    if (spinning || attempts >= 2 || !finishedRef.current) return;

    const spinIndex = attempts;
    const targetMark = 15 + (spinIndex === 0 ? 1 : 5) * 30;
    const currentRotation = rotationRef.current;
    const nextRotation =
      currentRotation -
      (currentRotation % 360) +
      2160 +
      ((90 - targetMark + 360) % 360);

    spinIndexRef.current = spinIndex;
    finishedRef.current = false;
    rotationRef.current = nextRotation;
    setRotation(nextRotation);
    setSpinning(true);
    timeoutRef.current = window.setTimeout(finishSpin, SPIN_FALLBACK);
  }, [attempts, finishSpin, spinning]);

  const retry = () => {
    setModal(null);
    spin();
  };

  const resetGame = () => {
    setModal(null);
    setAttempts(0);
  };

  return (
    <main
      data-effects-paused={pageHidden || spinning ? "true" : "false"}
      data-result-open={modal ? "true" : "false"}
      className="bg-night flex h-screen overflow-hidden flex-col justify-start px-4 pt-3 pb-2 text-center text-foreground"
    >
      <div className="game-background mx-auto w-full max-w-md">
        <div className="gold-pill mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1">
          <span aria-hidden="true">🎁</span>
          <span className="gold-text text-[13px] font-black tracking-wide">
            TENTE A SUA SORTE!
          </span>
        </div>
        <h1 className="mt-1 whitespace-nowrap text-[24px] leading-none font-black italic tracking-tight">
          <span className="silver-text">2 TENTATIVAS </span>
          <span className="gold-text">GRÁTIS!</span>
        </h1>
        <p className="mt-1 text-[12px] font-semibold text-white-ish">
          Não custa nada — clique no botão{" "}
          <span className="font-black text-gold">GIRAR!</span>
        </p>

        <Wheel rotation={rotation} spinning={spinning} onStop={finishSpin} />

        <button
          type="button"
          data-spin=""
          onClick={spin}
          disabled={spinning || attempts >= 2}
          className="btn-spin btn-blink mx-auto mt-3 flex w-[88%] items-center justify-center gap-2 rounded-2xl py-2.5 text-lg font-black disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3" />
            <path d="M18 3v4h-4M6 21v-4h4" />
          </svg>
          {spinning
            ? "A GIRAR..."
            : attempts === 1
              ? "GIRAR DE NOVO!"
              : "GIRAR AGORA!"}
        </button>

        <ActivityStats />
        <MoneyFloor />
      </div>

      {modal === "retry" && <TryAgainModal onRetry={retry} />}
      {modal === "prize" && (
        <PrizeModal onDismiss={resetGame} onRegister={resetGame} />
      )}
    </main>
  );
}
