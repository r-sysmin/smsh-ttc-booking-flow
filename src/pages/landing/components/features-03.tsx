import { type ElementType } from "react";

interface FeatureItem {
  name: string;
  description: string;
  icon: ElementType;
}

interface Features03Props {
  heading: string;
  features: FeatureItem[];
}

export function Features03({ heading, features }: Features03Props) {
  return (
    <section className="landing bg-muted/50 py-24">
      <div className="mx-auto max-w-page px-6 lg:px-8">
        <h2 className="text-center text-balance">{heading}</h2>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="flex flex-col items-center text-center">
              <dt className="flex flex-col items-center gap-3">
                <feature.icon
                  aria-hidden="true"
                  className="size-6 text-primary"
                />
                <span className="text-sm font-semibold text-foreground">
                  {feature.name}
                </span>
              </dt>
              <dd className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
