// src/app/menu/page.tsx

type MenuItem = { name: string; price: string; desc?: string };
type MenuSectionData = { id: string; title: string; items: MenuItem[] };

export default function MenuPage() {
  const sections: MenuSectionData[] = [
    {
      id: "cocktails",
      title: "Cocktails",
      items: [
        { name: "Pink Flamingo", price: "€12", desc: "Raspberry gin, Chambord, lemon juice, sugar syrup." },
        { name: "Classic Vodka Martini", price: "€12", desc: "Vodka, Noilly Prat, olive." },
        { name: "Classic Gin Martini", price: "€12", desc: "Gin, Noilly Prat, olive." },
        { name: "French Martini", price: "€12", desc: "Vodka, Chambord, pineapple juice." },
        { name: "Pornstar Martini", price: "€12", desc: "Vanilla vodka, passionfruit purée, vanilla syrup, champagne." },
        { name: "Espresso Martini", price: "€12", desc: "Vodka, Kahlua, espresso." },
        { name: "Strawberry Daiquiri", price: "€12", desc: "White rum, strawberry purée, lemon, sugar syrup." },
        { name: "Raspberry Daiquiri", price: "€12", desc: "White rum, raspberry purée, lemon, sugar syrup." },
        { name: "Cosmopolitan", price: "€12", desc: "Vodka, Cointreau, fresh lime, cranberry." },
        { name: "Twinkle", price: "€12", desc: "Vodka, elderflower liqueur, lemon, champagne." },
        { name: "Sex on the Beach", price: "€12", desc: "Vodka, Archers, grenadine, orange juice." },
        { name: "Salted Caramel Espresso Martini", price: "€12", desc: "Vanilla vodka, Kahlua, espresso, salted caramel." },
        { name: "Sloe Gin Gimlet", price: "€12", desc: "Sloe gin, lemon juice, sugar syrup, soda." },
        { name: "Burnt Hazelnut", price: "€12", desc: "Baileys, Frangelico, Kahlua, cream." },
        { name: "Whiskey Sour", price: "€12", desc: "Whiskey, lemon juice, sugar syrup, soda." },
        { name: "Grey Goose Le Fizz", price: "€13", desc: "Grey Goose vodka, elderflower liqueur, lime juice, soda." },
        { name: "Hawaiian Redneck", price: "€12", desc: "Dark rum, whiskey, pineapple juice." },
        { name: "Negroni", price: "€12", desc: "Gin, Campari, Martini Rosso." },
        { name: "Tom Collins", price: "€12", desc: "Double gin, lemon juice, sugar syrup, soda." },
        { name: "Long Island Iced Tea", price: "€15", desc: "Vodka, gin, tequila, rum, triple sec, lime, Pepsi." },
        { name: "Mai Tai", price: "€13", desc: "White rum, dark rum, Cointreau, grenadine, orange, pineapple." },
        { name: "Amaretto Sour", price: "€12", desc: "Amaretto, lemon juice, sugar syrup, soda." },
        { name: "Dark & Stormy", price: "€12", desc: "Dark rum, ginger beer, lime juice." },
        { name: "Bloody Mary", price: "€10", desc: "Vodka, tomato juice, Worcestershire, tabasco, celery." },
        { name: "Lemondrop Martini", price: "€12", desc: "Vodka, Cointreau, sugar syrup, lemon juice." },
        { name: "Pimms & Lemonade", price: "€10", desc: "Pimms, lemonade." },
        { name: "Piña Colada", price: "€12", desc: "White rum, coconut milk, pineapple juice." },
        { name: "Old Fashioned", price: "€12", desc: "Bourbon, angostura bitters, sugar, soda." },
        { name: "Kir Royale", price: "€12", desc: "Crème de cassis, champagne." },
      ],
    },
    {
      id: "mojitos",
      title: "Mojitos",
      items: [
        { name: "Classic Mojito", price: "€12", desc: "White rum, fresh lime, mint syrup, soda." },
        { name: "Pineapple Mojito", price: "€12", desc: "White rum, pineapple, lime, mint syrup, soda." },
        { name: "Passionfruit Mojito", price: "€12", desc: "White rum, passionfruit, lime, mint syrup, soda." },
        { name: "Raspberry Mojito", price: "€12", desc: "White rum, raspberries, lime, mint syrup, soda." },
      ],
    },
    {
      id: "margaritas",
      title: "Margaritas",
      items: [
        { name: "Classic Margarita", price: "€12", desc: "Tequila, triple sec, lime juice." },
        { name: "Strawberry Margarita", price: "€12", desc: "Tequila, triple sec, lime juice, strawberries." },
        { name: "Raspberry Margarita", price: "€12", desc: "Tequila, triple sec, lime juice, raspberries." },
        { name: "White Peach Margarita", price: "€12", desc: "Tequila, Cointreau, lime juice, white peach." },
      ],
    },
    {
      id: "prosecco",
      title: "Prosecco Cocktails",
      items: [
        { name: "Bellini", price: "€12", desc: "Prosecco, white peach purée." },
        { name: "Sloegasm", price: "€12", desc: "Prosecco, sloe gin." },
        { name: "Pimms Royal", price: "€12", desc: "Prosecco, gin, Pimms." },
        { name: "Grace Kelly", price: "€12", desc: "Prosecco, Aperol." },
        { name: "Marilyn Monroe", price: "€12", desc: "Prosecco, cassis." },
      ],
    },
    {
      id: "spritzers",
      title: "Spritzers",
      items: [
        { name: "Aperol Spritz", price: "€12", desc: "Aperol, prosecco, soda." },
        { name: "Limoncello Spritz", price: "€12", desc: "Limoncello, prosecco, soda." },
        { name: "Campari Spritz", price: "€12", desc: "Campari, dry rosé, lemonade." },
      ],
    },
    {
      id: "mocktails",
      title: "Mocktails",
      items: [
        { name: "Shirley Temple", price: "€8", desc: "Grenadine, lemon & lime, ginger ale." },
        { name: "Virgin Cosmopolitan", price: "€8", desc: "Cranberry, orange, lime." },
        { name: "Cinderella", price: "€8", desc: "Pineapple, orange, soda." },
        { name: "Virgin Mary", price: "€8", desc: "Tomato juice, Worcestershire, tabasco." },
        { name: "Baby Bellini", price: "€8", desc: "Apple, white peach purée." },
        { name: "Lime Ricky", price: "€8", desc: "Mint syrup, lime, soda." },
        { name: "Raspberry Ricky", price: "€8", desc: "Mint syrup, raspberries, lime, soda." },
      ],
    },
  ];

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-[1120px]">
        <div className="rounded-3xl bg-white/60 px-6 py-14 sm:px-10 sm:py-16 ring-1 ring-[#d9d9d9] shadow-[0_20px_60px_rgba(0,0,0,0.06)]">

          {/* BACK LINK */}
          <div className="mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1f1f1f]/70 hover:text-[#1f1f1f] transition"
            >
              ← Back to Home
            </a>
          </div>

          {/* HEADER */}
          <div className="text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-[#1f1f1f]/60">
              Menu
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-[-0.02em] text-[#1f1f1f]">
              Cocktails
            </h1>
            <p className="mt-3 mx-auto max-w-2xl text-[#1f1f1f]/70 leading-relaxed">
              Signature serves and timeless classics.
            </p>
          </div>

          {/* SECTIONS */}
          {sections.map((section) => (
            <section key={section.id} className="mt-16">
              <h2 className="text-2xl font-semibold text-[#1f1f1f] tracking-tight">
                {section.title}
              </h2>

              <div className="mt-6 grid gap-6">
                {section.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl bg-[#f5f4f1] px-6 py-5 ring-1 ring-[#d9d9d9]/60 shadow-[0_8px_25px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-start justify-between gap-6">
                      <h3 className="text-lg font-medium text-[#1f1f1f]">
                        {item.name}
                      </h3>
                      <span className="text-[#1f1f1f] font-medium whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                    {item.desc && (
                      <p className="mt-2 text-sm text-[#1f1f1f]/70 leading-relaxed">
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

        </div>
      </div>
    </main>
  );
}