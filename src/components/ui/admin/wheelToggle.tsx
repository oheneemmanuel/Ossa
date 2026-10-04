"use client";

import { useState, useTransition } from "react";
import { setWheelEnabled } from "@/lib/actions/wheelAdminAction";

export default function WheelToggle({ initial }: { initial: boolean }) {
  const [enabled, setEnabled] = useState(initial);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !enabled;
    setEnabled(next);
    startTransition(async () => {
      try {
        await setWheelEnabled(next);
      } catch {
        setEnabled(!next); // put it back if the save failed
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        disabled={pending}
        className={`relative h-7 w-12 rounded-full transition-colors disabled:opacity-60 ${
          enabled ? "bg-green-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </button>
      <span className="font-medium">{enabled ? "Wheel is ON" : "Wheel is OFF"}</span>
    </div>
  );
}