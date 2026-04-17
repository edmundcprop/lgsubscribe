import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-white">
      <div className="container-xl flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="text-[80px] font-extrabold leading-none text-lg-mist">
          404
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-lg-ink">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-lg-stone">
          Sorry, we could not find the page you are looking for. It may have been
          moved or no longer exists.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-full bg-lg-red px-8 text-[15px] font-medium text-white transition hover:bg-lg-red-dark"
          >
            Go to homepage
          </Link>
          <Link
            href="/products"
            className="inline-flex h-12 items-center rounded-full border border-black/10 px-8 text-[15px] font-medium text-lg-ink transition hover:bg-lg-mist"
          >
            Browse products
          </Link>
          <Link
            href="/blog"
            className="inline-flex h-12 items-center rounded-full border border-black/10 px-8 text-[15px] font-medium text-lg-ink transition hover:bg-lg-mist"
          >
            Read our blog
          </Link>
        </div>
      </div>
    </section>
  );
}
