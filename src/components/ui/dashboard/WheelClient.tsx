"use client";

import { useState, useTransition } from "react";
import { spinWheel } from "@/lib/actions/wheelAction";

type Prize = { id: string; label: string; color: string };

const SPIN_MS = 5000;
const EXTRA_TURNS = 6;

const WHATSAPP_NUMBER = "233544204635"; // OSSA WhatsApp number

export default function WheelClient({
  prizes,
  alreadyWon,
  alreadyWonDataMb,
  alreadyWonCode,
  userName,
}: {
  prizes: Prize[];
  alreadyWon: string | null;
  alreadyWonDataMb: number | null;
  alreadyWonCode: string | null;
  userName: string | null;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [won, setWon] = useState<string | null>(alreadyWon);
  const [wonDataMb, setWonDataMb] = useState<number | null>(alreadyWonDataMb);
  const [wonCode, setWonCode] = useState<string | null>(alreadyWonCode);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const n = prizes.length;
  const seg = 360 / n;
  const gradient = `conic-gradient(${prizes
    .map((p, i) => `${p.color} ${i * seg}deg ${(i + 1) * seg}deg`)
    .join(", ")})`;

  const locked = pending || spinning || won !== null;

  const waLink = wonCode
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hi! I'm ${userName || "a user"} and I won ${won} on the Spin the Wheel. My code is ${wonCode}.`,
      )}`
    : null;

  function onSpin() {
    setError(null);
    startTransition(async () => {
      const res = await spinWheel();
      if (!res.ok) {
        if (res.error === "ALREADY_SPUN") {
          // Reload so the page shows today's real prize and code.
          window.location.reload();
          return;
        }
        setError(
          res.error === "UNAUTHENTICATED"
            ? "Sign in to spin."
            : res.error === "DISABLED"
              ? "The wheel is closed right now."
              : "The wheel is unavailable right now. Try again shortly.",
        );
        return;
      }

      // The server already decided the prize. The wheel only animates to it.
      const index = prizes.findIndex((p) => p.id === res.prizeId);
      const mid = index * seg + seg / 2;
      const jitter = (Math.random() - 0.5) * seg * 0.6;
      const base = Math.ceil(rotation / 360) * 360 + EXTRA_TURNS * 360;

      setSpinning(true);
      setRotation(base + (360 - mid) + jitter);
      window.setTimeout(
        () => {
          setSpinning(false);
          setWon(res.label);
          setWonDataMb(res.dataMb);
          setWonCode(res.code);
        },
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : SPIN_MS,
      );
    });
  }

  if (n === 0) {
    return <p className="text-slate-300">No prizes are available yet.</p>;
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <div className="relative aspect-square w-full max-w-[22rem]">
        {/* Pointer */}
        <div
          aria-hidden
          className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 -translate-y-1 border-x-[14px] border-t-[26px] border-x-transparent border-t-amber-300 drop-shadow"
        />
        {/* Wheel */}
        <div
          className="relative h-full w-full rounded-full border-8 border-slate-800 shadow-2xl motion-reduce:!transition-none"
          style={{
            background: gradient,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.7, 0.1, 1)`
              : "none",
          }}
        >
          {prizes.map((p, i) => (
            <div
              key={p.id}
              className="absolute inset-0"
              style={{ transform: `rotate(${i * seg + seg / 2}deg)` }}
            >
              <span className="absolute left-1/2 top-[9%] -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
                {p.label}
              </span>
            </div>
          ))}
          <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-800 bg-slate-950" />
        </div>
      </div>

      <div className="min-h-24 text-center" aria-live="polite">
        {won ? (
          wonDataMb === 0 ? (
            <p className="text-xl font-semibold">
              No data this time
              <span className="mt-1 block text-sm font-normal text-slate-300">
                Come back tomorrow for another spin.
              </span>
            </p>
          ) : (
            <div>
              <p className="text-xl font-semibold">
                You won <span className="text-amber-300">{won}</span>
              </p>
              {wonCode && (
                <p className="mt-2 text-sm text-slate-300">
                  Your win code:{" "}
                  <span className="font-mono font-semibold text-white">
                    {wonCode}
                  </span>
                </p>
              )}
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-full bg-green-500 px-8 py-3 font-bold text-slate-950 transition hover:bg-green-400 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Claim on WhatsApp
                </a>
              )}
            </div>
          )
        ) : (
          <button
            onClick={onSpin}
            disabled={locked}
            className="rounded-full bg-amber-300 px-10 py-3 text-lg font-bold text-slate-950 transition hover:bg-amber-200 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending || spinning ? "Spinning…" : "Spin the wheel"}
          </button>
        )}
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  );
}