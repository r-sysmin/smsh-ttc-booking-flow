import { Link } from "react-router-dom";
import { Button } from "@/components/base/button";

interface Hero02Props {
  headline: string;
  subhead: string;
  primaryCta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
}

export function Hero02({
  headline,
  subhead,
  primaryCta,
  secondaryCta,
}: Hero02Props) {
  return (
    <section className="landing bg-primary text-white py-24">
      <div className="mx-auto max-w-page px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h1 className="text-balance text-white">{headline}</h1>
          <p className="mt-6 text-pretty text-lg text-white/80">
            {subhead}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild variant="secondary">
              <Link to={primaryCta.to}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta && (
              <Button
                variant="outline"
                asChild
                className="border-white/40 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
