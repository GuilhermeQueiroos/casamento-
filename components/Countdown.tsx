"use client";

import { useEffect, useState } from "react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calc() {
      const diff = Math.max(new Date(targetDate).getTime() - Date.now(), 0);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { value: timeLeft.days, label: "Dias" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div className="flex gap-8 md:gap-12">
      {items.map((item) => (
        <div key={item.label} className="text-center">
          <span className="font-playfair text-5xl md:text-6xl text-stone-700">
            {String(item.value).padStart(2, "0")}
          </span>
          <p className="font-lato text-xs tracking-widest uppercase text-stone-400 mt-1">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
