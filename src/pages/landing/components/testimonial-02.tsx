interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
}

interface Testimonial02Props {
  heading: string;
  testimonials: TestimonialItem[];
}

export function Testimonial02({ heading, testimonials }: Testimonial02Props) {
  return (
    <section className="landing py-24">
      <div className="mx-auto max-w-page px-6 lg:px-8">
        <h2 className="text-center text-balance">{heading}</h2>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-lg border border-border p-6"
            >
              <p className="text-sm text-foreground">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4">
                <p className="text-sm font-semibold text-foreground">
                  {t.name}
                </p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
