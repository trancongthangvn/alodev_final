'use client';

import { useState, useEffect } from 'react';
import { parseArticleBlock, type ParseResult } from '@/lib/articleImport';

// alodev doesn't have a custom Dialog/Toast system — use native browser
// primitives.  Admin-only UI, single-user (founder), safe to use confirm().
const confirmDialog = async (msg: string, _opts?: { danger?: boolean }) =>
  typeof window !== 'undefined' ? window.confirm(msg) : false;
const showToast = (msg: string, _type: 'success' | 'error' | 'info' = 'success') => {
  // Toast surface: re-use alert for now; BlogEditor's setStatusMsg wraps the
  // in-DOM banner.  Console.log keeps a debugging trail.
  console.log(`[paste-import] ${msg}`);
  if (typeof window !== 'undefined') {
    // No persistent banner — defer to onImport callback for visible feedback.
  }
};

const MAX_INPUT_BYTES = 500 * 1024;
const DEBOUNCE_MS = 350;

interface Props {
  onImport: (result: ParseResult) => void;
  hasExistingContent?: boolean;
}

type Tab = 'stats' | 'schema' | 'preview' | 'checklist';

export default function PasteImport({ onImport, hasExistingContent = false }: Props) {
  const [raw, setRaw] = useState('');
  const [result, setResult] = useState<ParseResult | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [tooLarge, setTooLarge] = useState(false);
  const [tab, setTab] = useState<Tab>('stats');

  useEffect(() => {
    setTooLarge(false);
    if (!raw.trim()) {
      setResult(null);
      setParsing(false);
      return;
    }
    if (raw.length > MAX_INPUT_BYTES) {
      setTooLarge(true);
      setResult(null);
      setParsing(false);
      return;
    }
    setParsing(true);
    const timer = setTimeout(() => {
      try {
        setResult(parseArticleBlock(raw));
      } catch (e) {
        setResult({
          ok: false,
          article: undefined,
          stats: undefined,
          errors: [`Parse crash: ${e instanceof Error ? e.message : String(e)}`],
          warnings: [],
          missing_required: [],
          post_publish_checklist: [],
          raw: { frontmatter: {}, html_body: '' },
        });
      } finally {
        setParsing(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [raw]);

  async function handleApply() {
    if (!result?.article) return;
    if (hasExistingContent) {
      if (!(await confirmDialog('Tiêu đề / nội dung hiện tại có thể bị thay thế. Tiếp tục?', { danger: true }))) return;
    }
    onImport(result);
    const s = result.stats;
    let msg = 'Đã điền form';
    if (s) msg += ` (${s.word_count} từ, ${s.h2_count} H2, ${s.faq_count} FAQ)`;
    showToast(msg, 'success');
    setExpanded(false);
  }

  const a = result?.article;
  const s = result?.stats;
  const errors = result?.errors ?? [];
  const warnings = result?.warnings ?? [];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="w-11 h-11 rounded-lg shrink-0 flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Dán block SEO từ Claude Project (YAML + HTML)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Auto tách metadata + build schema/og/twitter + điền form + tạo bài mới
          </p>
        </div>
        <svg className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={10}
            placeholder="Dán block YAML + HTML từ Claude Project..."
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 resize-y"
          />

          {tooLarge && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300">
              Input quá lớn ({(raw.length / 1024).toFixed(0)} KB &gt; 500 KB).
            </div>
          )}

          {parsing && !result && (
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin" />
              Đang parse...
            </div>
          )}

          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Lỗi parse</p>
              <ul className="text-xs text-red-700 dark:text-red-300 space-y-0.5 list-disc list-inside">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
              {result && result.missing_required.length > 0 && (
                <p className="text-xs text-red-700 dark:text-red-300 mt-2">
                  Missing: <code className="font-mono bg-red-100 dark:bg-red-900/40 px-1 rounded">{result.missing_required.join(', ')}</code>
                </p>
              )}
            </div>
          )}

          {result?.ok && a && s && (
            <>
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                {[
                  { id: 'stats' as const, label: 'Stats' },
                  { id: 'schema' as const, label: 'Schema' },
                  { id: 'preview' as const, label: 'HTML' },
                  { id: 'checklist' as const, label: 'Checklist' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex-1 px-2 py-1.5 text-xs font-semibold rounded transition-colors ${
                      tab === t.id ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === 'stats' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <Kpi label="Từ" value={s.word_count} />
                    <Kpi label="Đọc" value={`${s.reading_time_minutes}p`} />
                    <Kpi label="H2" value={s.h2_count} />
                    <Kpi label="H3" value={s.h3_count} />
                    <Kpi label="Ảnh" value={s.image_count} />
                    <Kpi label="Internal" value={s.internal_link_count} />
                    <Kpi label="External" value={s.external_link_count} />
                    <Kpi label="FAQ" value={s.faq_count} />
                    <Kpi label="Takeaways" value={s.key_takeaways_count} />
                    <Kpi label="Paragraphs" value={s.paragraph_count} />
                    <Kpi label="KW hits" value={s.keyword_occurrences} />
                    <Kpi
                      label="Density"
                      value={`${s.keyword_density.toFixed(2)}%`}
                      tone={s.keyword_density < 0.5 || s.keyword_density > 2 ? 'bad' : 'good'}
                    />
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs space-y-1.5">
                    <Row label="SEO title" value={a.seo_title} warn={a.seo_title.length > 60} />
                    <Row label="Meta desc" value={`${a.meta_description.slice(0, 80)}${a.meta_description.length > 80 ? '…' : ''} (${a.meta_description.length})`} warn={a.meta_description.length < 140 || a.meta_description.length > 160} />
                    <Row label="Slug" value={a.slug} mono />
                    <Row label="Canonical" value={a.canonical_url} mono truncate />
                    <Row label="Content type" value={a.content_type} />
                    <Row label="Focus KW" value={a.focus_keyword} />
                    <Row label="Tags" value={a.tags.join(', ')} />
                    <Row label="Author" value={`${a.author.name} — ${a.author.job_title}`} />
                    <Row label="Featured" value={a.featured_image?.url} mono truncate />
                  </div>

                  {warnings.length > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                      <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                        Cảnh báo SEO ({warnings.length})
                      </p>
                      <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-0.5 list-disc list-inside max-h-40 overflow-y-auto">
                        {warnings.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === 'schema' && (
                <pre className="bg-gray-900 text-cyan-300 font-mono text-[10px] p-3 rounded max-h-80 overflow-auto whitespace-pre">
                  {JSON.stringify(a.schema, null, 2)}
                </pre>
              )}

              {tab === 'preview' && (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-80 overflow-auto">
                  <pre className="text-[10px] text-gray-600 dark:text-gray-300 font-mono whitespace-pre-wrap break-all">
                    {a.html_body.slice(0, 4000)}
                    {a.html_body.length > 4000 && `\n\n... (${a.html_body.length - 4000} ký tự nữa)`}
                  </pre>
                </div>
              )}

              {tab === 'checklist' && (
                <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Sau khi deploy, làm tuần tự:</p>
                  <ol className="text-xs text-gray-700 dark:text-gray-200 space-y-1.5">
                    {result.post_publish_checklist.map((c, i) => (
                      <li key={c.key} className="flex items-start gap-2">
                        <span className="text-purple-600 dark:text-purple-400 font-mono shrink-0">{i + 1}.</span>
                        <span className="flex-1">
                          {c.label}
                          {c.url && (
                            <a href={c.url} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-600 dark:text-blue-400 hover:underline">↗</a>
                          )}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => { setRaw(''); setResult(null); }}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Xoá
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Tạo bài viết từ block này
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'good' | 'bad' }) {
  const color =
    tone === 'bad' ? 'text-red-600 dark:text-red-400'
    : tone === 'good' ? 'text-green-600 dark:text-green-400'
    : 'text-gray-900 dark:text-gray-100';
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">{label}</p>
      <p className={`text-lg font-bold leading-tight ${color}`}>{value}</p>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
  truncate = false,
  warn = false,
}: {
  label: string;
  value?: unknown;
  mono?: boolean;
  truncate?: boolean;
  warn?: boolean;
}) {
  const display =
    typeof value === 'string' ? value
    : value == null ? ''
    : typeof value === 'number' || typeof value === 'boolean' ? String(value)
    : JSON.stringify(value).slice(0, 200);
  return (
    <div className="flex gap-3">
      <span className="text-gray-500 dark:text-gray-400 w-[100px] shrink-0">{label}</span>
      <span
        className={`flex-1 min-w-0 ${mono ? 'font-mono' : ''} ${
          warn ? 'text-amber-700 dark:text-amber-400'
          : display ? 'text-gray-900 dark:text-gray-100'
          : 'text-gray-400 italic'
        } ${truncate ? 'truncate' : ''}`}
      >
        {display || '(trống)'}
      </span>
    </div>
  );
}
