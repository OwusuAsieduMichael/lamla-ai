"use client";

import { useState } from "react";

import { completeWelcomeAction } from "@/app/actions/welcome";
import { Button } from "@/components/ui/button";
import { welcomeSlides } from "@/config/welcome";
import { cn } from "@/lib/utils";

export function WelcomeCarousel() {
  const [index, setIndex] = useState(0);
  const slide = welcomeSlides[index];
  const isLast = index === welcomeSlides.length - 1;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12">
      <section
        aria-roledescription="carousel"
        aria-label="Welcome to LAMLA"
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div
          role="tablist"
          aria-label="Introduction tabs"
          className="grid grid-cols-3 border-b border-border bg-secondary/60"
        >
          {welcomeSlides.map((item, slideIndex) => {
            const selected = slideIndex === index;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`welcome-tab-${item.id}`}
                aria-selected={selected}
                aria-controls={`welcome-panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                className={cn(
                  "px-3 py-3 text-sm font-medium transition-colors",
                  selected
                    ? "bg-card text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setIndex(slideIndex)}
              >
                {item.tab}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`welcome-panel-${slide.id}`}
          aria-labelledby={`welcome-tab-${slide.id}`}
          className="space-y-6 p-6 sm:p-8"
        >
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {index + 1} of {welcomeSlides.length}
          </p>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {slide.title}
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              {slide.body}
            </p>
          </div>
          <ul className="space-y-2">
            {slide.points.map((point) => (
              <li
                key={point}
                className="rounded-lg border border-brand-green/20 bg-secondary px-3 py-2 text-sm text-secondary-foreground"
              >
                {point}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex((current) => Math.max(0, current - 1))}
            >
              Back
            </Button>
            {isLast ? (
              <div className="flex flex-wrap gap-3">
                <form action={completeWelcomeAction}>
                  <input type="hidden" name="destination" value="login" />
                  <Button type="submit" variant="outline">
                    Sign in
                  </Button>
                </form>
                <form action={completeWelcomeAction}>
                  <input type="hidden" name="destination" value="signup" />
                  <Button type="submit">Create account</Button>
                </form>
              </div>
            ) : (
              <Button
                type="button"
                onClick={() =>
                  setIndex((current) =>
                    Math.min(welcomeSlides.length - 1, current + 1),
                  )
                }
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
