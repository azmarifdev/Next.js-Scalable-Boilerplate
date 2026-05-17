import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Marked, Renderer } from "marked";
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

const markedRenderer = new Renderer();

markedRenderer.heading = ({ text, depth }) => {
  return `<h${depth} class="docs-heading docs-h${depth}">${text}</h${depth}>`;
};

markedRenderer.paragraph = ({ text }) => {
  return `<p class="docs-paragraph">${text}</p>`;
};

markedRenderer.list = ({ ordered, items, start }) => {
  const tag = ordered ? "ol" : "ul";
  const cls = ordered ? "docs-list docs-list-ordered" : "docs-list docs-list-unordered";
  const startAttr = ordered && start !== 1 ? ` start="${start}"` : "";
  const body = items
    .map((item) => {
      const taskAttr = item.task ? ` class="docs-task-list-item"` : "";
      const checkbox =
        item.task && item.checked !== undefined
          ? `<input type="checkbox"${item.checked ? " checked" : ""} disabled /> `
          : "";
      return `<li${taskAttr}>${checkbox}${item.text}</li>`;
    })
    .join("\n");
  return `<${tag} class="${cls}"${startAttr}>\n${body}\n</${tag}>`;
};

markedRenderer.listitem = ({ text, task, checked }) => {
  const taskAttr = task ? ` class="docs-task-list-item"` : "";
  const checkbox =
    task && checked !== undefined
      ? `<input type="checkbox"${checked ? " checked" : ""} disabled /> `
      : "";
  return `<li${taskAttr}>${checkbox}${text}</li>`;
};

markedRenderer.blockquote = ({ text }) => {
  return `<blockquote class="docs-blockquote">${text}</blockquote>`;
};

markedRenderer.code = ({ text, lang }) => {
  if (lang === "mermaid") {
    return `<div class="docs-mermaid">\n${text}\n</div>`;
  }
  const codeB64 = Buffer.from(text, "utf-8").toString("base64");
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<div class="docs-code-wrap"><div class="docs-code-toolbar"><button type="button" class="docs-copy-btn" data-copy-b64="${codeB64}">Copy</button></div><pre class="docs-code-block"><code class="language-${lang || "plain"}">${escaped}</code></pre></div>`;
};

markedRenderer.codespan = ({ text }) => {
  return `<code class="docs-inline-code">${text}</code>`;
};

markedRenderer.link = ({ href, text }) => {
  return `<a href="${href}" target="_blank" rel="noreferrer" class="docs-inline-link">${text}</a>`;
};

markedRenderer.table = ({ header, rows }) => {
  const thead = header.map((cell) => `<th class="docs-th">${cell.text}</th>`).join("\n");
  const tbody = rows
    .map(
      (row) =>
        `<tr class="docs-tr">${row
          .map((cell) => `<td class="docs-td">${cell.text}</td>`)
          .join("\n")}</tr>`
    )
    .join("\n");
  return `<div class="docs-table-wrap"><table class="docs-table">\n<thead>\n<tr class="docs-tr">${thead}</tr>\n</thead>\n<tbody>\n${tbody}\n</tbody>\n</table></div>`;
};

markedRenderer.hr = () => {
  return `<hr class="docs-hr" />`;
};

markedRenderer.image = ({ href, text }) => {
  return `<img src="${href}" alt="${text}" class="docs-image" loading="lazy" />`;
};

markedRenderer.strong = ({ text }) => `<strong>${text}</strong>`;
markedRenderer.em = ({ text }) => `<em>${text}</em>`;
markedRenderer.del = ({ text }) => `<del>${text}</del>`;

const marked = new Marked({ renderer: markedRenderer, gfm: true, breaks: false });

function renderMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown, { async: false }) as string;
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
    <main className="landing-shell docs-shared-gradient docs-article-shell scroll-page min-h-screen overflow-x-clip">
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
