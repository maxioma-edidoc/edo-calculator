/* Style: Страница-обёртка сохраняет динамичный B2B SaaS flow и отдаёт весь фокус калькулятору. */
import EDOCalculator from "@/components/EDOCalculator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <EDOCalculator />
    </div>
  );
}
