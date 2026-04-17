import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { getPost, posts } from "@/lib/posts";
import { absoluteUrl, whatsappLink } from "@/lib/site";
import { articleSchema, breadcrumbSchema } from "@/lib/jsonld";

export const generateStaticParams = () =>
  posts.map((p) => ({ slug: p.slug }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      title: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image, width: 1600, height: 1062, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
};

/** Sanitise a string for safe injection into innerHTML */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/on\w+\s*=\s*'[^']*'/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "");
}

function renderBody(body: string) {
  const lines = body.trim().split("\n");
  const out: React.ReactNode[] = [];
  let tableRows: string[] = [];
  let inTable = false;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      out.push(
        <p
          key={`p-${out.length}`}
          className="my-6 text-[17px] leading-[1.7] text-lg-ink"
        >
          {para.join(" ")}
        </p>
      );
      para = [];
    }
  };

  const flushTable = () => {
    if (!tableRows.length) return;
    const rows = tableRows.map((r) =>
      r
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim())
    );
    const header = rows[0];
    const body = rows.slice(2);
    out.push(
      <div
        key={`t-${out.length}`}
        className="my-10 overflow-hidden rounded-2xl bg-lg-mist"
      >
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-black/[0.08]">
              {header.map((h, i) => (
                <th key={i} className="px-6 py-4 font-semibold text-lg-ink">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((r, i) => (
              <tr key={i} className="border-b border-black/[0.05] last:border-0">
                {r.map((c, j) => {
                  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
                  if (linkRe.test(c)) {
                    return (
                      <td
                        key={j}
                        className="px-6 py-4 text-lg-stone"
                        dangerouslySetInnerHTML={{
                          __html: sanitize(
                            c.replace(
                              /\[([^\]]+)\]\(([^)]+)\)/g,
                              '<a href="$2" class="text-lg-red hover:underline">$1</a>'
                            )
                          ),
                        }}
                      />
                    );
                  }
                  return (
                    <td key={j} className="px-6 py-4 text-lg-stone">
                      {c}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
  };

  lines.forEach((raw) => {
    const line = raw.trim();
    if (line.startsWith("|")) {
      flushPara();
      inTable = true;
      tableRows.push(line);
      return;
    }
    if (inTable && !line.startsWith("|")) {
      flushTable();
    }
    /* ── linked image: [![alt](img)](url) ── */
    const linkedImg = line.match(
      /^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)$/
    );
    if (linkedImg) {
      flushPara();
      const [, alt, src, href] = linkedImg;
      out.push(
        <a key={`limg-${out.length}`} href={href} className="my-8 block">
          <img
            src={src}
            alt={alt}
            className="w-full rounded-2xl object-contain"
            loading="lazy"
          />
        </a>
      );
      return;
    }

    /* ── standalone image: ![alt](src) ── */
    const img = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      flushPara();
      const [, alt, src] = img;
      out.push(
        <img
          key={`img-${out.length}`}
          src={src}
          alt={alt}
          className="my-8 w-full rounded-2xl object-contain"
          loading="lazy"
        />
      );
      return;
    }

    if (line.startsWith("## ")) {
      flushPara();
      out.push(
        <h2
          key={`h2-${out.length}`}
          className="mt-14 mb-4 text-3xl font-semibold tracking-tight text-lg-ink"
        >
          {line.replace(/^##\s+/, "")}
        </h2>
      );
      return;
    }
    if (line === "") {
      flushPara();
      return;
    }
    if (line.startsWith("- ")) {
      flushPara();
      out.push(
        <li
          key={`li-${out.length}`}
          className="my-2 ml-6 list-disc text-[17px] leading-[1.7] text-lg-ink"
        >
          {line.slice(2)}
        </li>
      );
      return;
    }
    const hasInline =
      /\*\*(.+?)\*\*/.test(line) || /\[([^\]]+)\]\(([^)]+)\)/.test(line);
    if (hasInline) {
      flushPara();
      const html = sanitize(
        line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" class="text-lg-red hover:underline">$1</a>'
          )
      );
      out.push(
        <p
          key={`p-${out.length}`}
          className="my-6 text-[17px] leading-[1.7] text-lg-ink"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
      return;
    }
    para.push(line);
  });

  flushPara();
  flushTable();
  return out;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const crumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={articleSchema(post)} />
      <JsonLd data={breadcrumbSchema(crumbs)} />

      <section className="border-b border-black/[0.05] bg-white">
        <div className="container-xl py-5 text-[12px] text-lg-stone">
          <Link href="/" className="hover:text-lg-red">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-lg-red">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-lg-ink">{post.title}</span>
        </div>
      </section>

      <article className="bg-white pb-24">
        <header className="bg-lg-mist">
          <div className="container-xl py-20 lg:py-24">
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.15em]">
                <span className="text-lg-red">{post.category}</span>
                <span className="text-lg-stone">·</span>
                <span className="text-lg-stone">{post.readingTime}</span>
                <span className="text-lg-stone">·</span>
                <time className="text-lg-stone">
                  {new Date(post.date).toLocaleDateString("en-MY", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <h1 className="display mt-6 text-balance">{post.title}</h1>
              <p className="lede mt-8 max-w-2xl">{post.excerpt}</p>
            </div>
          </div>
        </header>

        <div className="container-xl mt-16">
          <div className="mx-auto max-w-3xl">
            <div className="overflow-hidden rounded-[28px] bg-lg-mist">
              <img
                src={post.image}
                alt={post.title}
                className="h-auto w-full"
              />
            </div>
            <div className="mt-16">{renderBody(post.body)}</div>

            <div className="mt-20 rounded-[28px] bg-lg-ink p-10 text-white lg:p-14">
              <div className="eyebrow text-lg-red-light">Ready to talk?</div>
              <h3 className="title mt-4 text-balance">
                Get a plan recommendation tailored to your home.
              </h3>
              <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/70">
                Chat with our LG Subscribe consultants on WhatsApp. We&apos;ll
                walk through your needs and send a quick recommendation with no
                pressure to commit.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={whatsappLink(
                    `Hi, I read the article "${post.title}" and would like a recommendation.`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  Chat on WhatsApp
                </a>
                <Link
                  href="/products"
                  className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-[15px] font-medium text-white hover:bg-white hover:text-lg-ink"
                >
                  Browse products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
