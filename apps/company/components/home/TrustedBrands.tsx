const brands = [
  "Kirana Mart",
  "UrbanThreads",
  "GreenGrocer",
  "TechBazaar",
  "GoldLeaf Jewels",
  "HomeNest",
  "GlowBeauty",
  "SportZone",
];

export default function TrustedBrands() {
  const items = [...brands, ...brands];

  return (
    <section className="border-y border-viz-border bg-viz-bg-2 py-10">
      <div className="container-viz mb-6">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-viz-paragraph">
          Trusted by local retailers across categories
        </p>
      </div>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-14">
          {items.map((brand, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-lg font-semibold text-viz-heading/40"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
