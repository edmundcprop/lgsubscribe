import Link from "next/link";
import { categories } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import T from "@/components/T";

export default function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-lg-mist">
      <div className="container-xl py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center">
              <img
                src="/logo.svg"
                alt="LG Subscribe Malaysia"
                className="h-8 w-auto"
              />
            </div>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-lg-stone">
              <T
                en="Premium LG home appliances on a flexible monthly plan. Designed for Malaysian families upgrading, moving, or renovating."
                ms="Peralatan rumah LG premium dengan pelan bulanan yang fleksibel. Direka untuk keluarga Malaysia yang menaik taraf, berpindah atau mengubah suai."
              />
            </p>
            <a
              href={whatsappLink(
                "Hi, I'd like to know more about LG Subscribe plans."
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp mt-8"
            >
              WhatsApp {site.whatsapp.display}
            </a>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-ink">
              <T en="Shop" ms="Beli-belah" />
            </h4>
            <ul className="mt-5 space-y-3 text-[13px] text-lg-stone">
              {categories.slice(0, 6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="hover:text-lg-red"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-ink">
              <T en="More" ms="Lagi" />
            </h4>
            <ul className="mt-5 space-y-3 text-[13px] text-lg-stone">
              {categories.slice(6).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="hover:text-lg-red"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="hover:text-lg-red">
                  <T en="All products" ms="Semua produk" />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-lg-ink">
              <T en="Support" ms="Sokongan" />
            </h4>
            <ul className="mt-5 space-y-3 text-[13px] text-lg-stone">
              <li>
                <Link href="/how-it-works" className="hover:text-lg-red">
                  <T en="How It Works" ms="Cara Kerjanya" />
                </Link>
              </li>
              <li>
                <Link href="/#why" className="hover:text-lg-red">
                  <T en="Why Subscribe" ms="Kenapa Langgan" />
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-lg-red">
                  <T en="FAQ" ms="Soalan Lazim" />
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-lg-red">
                  <T en="Blog" ms="Blog" />
                </Link>
              </li>
              <li>
                <Link href="/enquire" className="hover:text-lg-red">
                  <T en="Subscribe" ms="Langgan" />
                </Link>
              </li>
              <li className="pt-2 text-lg-silver">{site.contact.email}</li>
              <li className="text-lg-silver">{site.contact.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-black/[0.06] pt-8 sm:flex-row sm:items-center">
          <p className="text-[11px] text-lg-silver">
            © {new Date().getFullYear()} LG Subscribe Malaysia.{" "}
            <T en="Authorised reseller." ms="Penjual sah." />
          </p>
          <p className="text-[11px] text-lg-silver">Life&apos;s Good.</p>
        </div>
      </div>
    </footer>
  );
}
