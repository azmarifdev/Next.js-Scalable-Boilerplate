import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";

import { DocsMarkdown } from "@/components/docs/DocsMarkdown";
import { Navbar } from "@/components/landing/Navbar";
import {
  docEntries,
  getDocBySlug,
  getGithubHref,
  getLocalizedDocBySlug,
  normalizeLocale,
  readDocSource
} from "@/lib/docs/content";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

function renderInline(content: string): string {
  return content
    .replace(/`([^`]+)`/g, '<code class="docs-inline-code">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noreferrer" class="docs-inline-link">$1</a>'
    );
}

function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let inCode = false;
  let codeLang = "";
  let codeLines: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine;

    if (line.startsWith("```")) {
      closeLists();
      if (!inCode) {
        codeLang = line.replace("```", "").trim();
        codeLines = [];
        inCode = true;
      } else {
        const codeText = codeLines.join("\n");
        const codeB64 = Buffer.from(codeText, "utf-8").toString("base64");
        const escapedCode = codeText
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        html.push(
          `<div class="docs-code-wrap"><div class="docs-code-toolbar"><button type="button" class="docs-copy-btn" data-copy-b64="${codeB64}">Copy</button></div><pre class="docs-code-block"><code class="language-${codeLang || "plain"}">${escapedCode}</code></pre></div>`
        );
        inCode = false;
        codeLang = "";
        codeLines = [];
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      closeLists();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeLists();
      const level = headingMatch[1].length;
      html.push(
        `<h${level} class="docs-heading docs-h${level}">${renderInline(headingMatch[2])}</h${level}>`
      );
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedMatch) {
      if (!inOl) {
        closeLists();
        html.push('<ol class="docs-list docs-list-ordered">');
        inOl = true;
      }
      html.push(`<li>${renderInline(orderedMatch[1])}</li>`);
      continue;
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
    if (unorderedMatch) {
      if (!inUl) {
        closeLists();
        html.push('<ul class="docs-list docs-list-unordered">');
        inUl = true;
      }
      html.push(`<li>${renderInline(unorderedMatch[1])}</li>`);
      continue;
    }

    if (line.startsWith("> ")) {
      closeLists();
      html.push(`<blockquote class="docs-blockquote">${renderInline(line.slice(2))}</blockquote>`);
      continue;
    }

    closeLists();
    html.push(`<p class="docs-paragraph">${renderInline(line)}</p>`);
  }

  closeLists();
  return html.join("\n");
}

export async function generateStaticParams() {
  return docEntries.map((entry) => ({ slug: entry.slug }));
}

export default async function DocArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const locale = normalizeLocale(await getLocale());
  const entry = getDocBySlug(slug);
  const localizedEntry = getLocalizedDocBySlug(slug, locale);

  if (!entry || !localizedEntry) {
    notFound();
  }

  const markdown = await readDocSource(localizedEntry.sourcePath);
  const contentHtml = renderMarkdownToHtml(markdown);

  return (
    <main className="landing-shell docs-shared-gradient docs-article-shell min-h-screen overflow-x-clip">
      <Navbar />

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[900px]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Link
              href="/docs"
              className="docs-chip-link inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition"
            >
              <ArrowLeft className="h-4 w-4" />
              {locale === "bn" ? "ডকসে ফিরে যান" : "Back to Docs"}
            </Link>

            <a
              href={getGithubHref(localizedEntry.sourcePath)}
              target="_blank"
              rel="noreferrer"
              className="docs-chip-link inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-sm font-medium transition"
            >
              {locale === "bn" ? "GitHub-এ দেখুন" : "View on GitHub"}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <article className="docs-article-card rounded-[26px] p-6 sm:p-8">
            <p className="docs-category-tag text-xs font-semibold tracking-[0.2em] uppercase">
              {localizedEntry.category}
            </p>
            <h1 className="docs-article-title mt-2 text-3xl font-semibold tracking-[-0.03em]">
              {localizedEntry.title}
            </h1>
            <p className="docs-article-description mt-2 text-[15px] leading-7">
              {localizedEntry.description}
            </p>

            <div className="docs-divider mt-7 pt-3 text-sm">{localizedEntry.readTime}</div>

            <DocsMarkdown html={contentHtml} />
          </article>
        </div>
      </section>
    </main>
  );
}
