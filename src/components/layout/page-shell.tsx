import type { ReactNode } from "react";

type PageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <main id="main-content" className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-6 py-12">
        <header className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </header>
        {children}
      </div>
    </main>
  );
}
