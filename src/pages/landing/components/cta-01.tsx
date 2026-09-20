import { Link } from "react-router-dom";
import { Button } from "@/components/base/button";

interface Cta01Props {
  heading: string;
  primaryCta: { label: string; to: string };
}

export function Cta01({ heading, primaryCta }: Cta01Props) {
  return (
    <section className="landing py-24">
      <div className="mx-auto max-w-page px-6 text-center lg:px-8">
        <h2 className="text-balance">{heading}</h2>
        <div className="mt-10">
          <Button asChild>
            <Link to={primaryCta.to}>{primaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
