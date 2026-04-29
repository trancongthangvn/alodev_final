"use client";

import { useMemo, useState } from "react";
import { extractImages, findImagesMissingAlt, setImageAlt } from "@/lib/alt-text";

/**
 * Inline "alt-text issues" panel — drops below a rich-text editor (or anywhere HTML is
 * authored) and lets the admin fill in missing alt attributes without diving into the HTML.
 *
 * Parent owns the HTML state and passes an `onChange(html)` callback.
 */
export default function ImageAltAudit({
  html,
  onChange,
  compact = false,
}: {
  html: string;
  onChange?: (nextHtml: string) => void;
  compact?: boolean;
}) {
  const issues = useMemo(() => findImagesMissingAlt(html), [html]);
  const all = useMemo(() => extractImages(html), [html]);
  const [expanded, setExpanded] = useState(!compact);

  if (all.length === 0) return null;

  const okCount = all.length - issues.length;
  const allOk = issues.length === 0;

  return (
    <div
      className={`rounded-lg border text-sm ${
        allOk
          ? "border-emerald-200/70 bg-emerald-50 dark:bg-emerald-500/10 dark:border-emerald-500/30"
          : "border-amber-300/70 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/30"
      }`}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 gap-2 text-left"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden>{allOk ? "✅" : "⚠️"}</span>
          <span className={`font-semibold ${allOk ? "text-emerald-700 dark:text-emerald-300" : "text-amber-800 dark:text-amber-200"}`}>
            {allOk
              ? `Tất cả ${all.length} ảnh đã có alt-text`
              : `${issues.length}/${all.length} ảnh thiếu alt-text`}
          </span>
        </span>
        <span className="flex items-center gap-2">
          {!allOk && okCount > 0 && (
            <span className="text-[11px] text-gray-500 dark:text-gray-400">
              {okCount} ảnh đã OK
            </span>
          )}
          <span className="text-gray-400 text-xs">{expanded ? "Thu gọn" : "Xem chi tiết"}</span>
        </span>
      </button>

      {expanded && !allOk && (
        <div className="border-t border-amber-300/50 dark:border-amber-500/30 divide-y divide-amber-200/60 dark:divide-amber-500/20">
          {issues.map((img) => (
            <ImgRow
              key={`${img.index}-${img.src}`}
              src={img.src}
              index={img.index}
              initialAlt={img.alt}
              readOnly={!onChange}
              onSave={(nextAlt) => {
                if (!onChange) return;
                onChange(setImageAlt(html, img.index, nextAlt));
              }}
            />
          ))}
          <div className="px-3 py-2 text-[11px] text-gray-500 dark:text-gray-400">
            💡 Alt-text giúp SEO và người dùng khiếm thị. Nên mô tả ảnh 1 câu ngắn, không dùng
            &quot;hình ảnh&quot; hay &quot;ảnh&quot; ở đầu câu.
          </div>
        </div>
      )}
    </div>
  );
}

function ImgRow({
  src, index, initialAlt, readOnly, onSave,
}: {
  src: string;
  index: number;
  initialAlt: string;
  readOnly: boolean;
  onSave: (alt: string) => void;
}) {
  const [value, setValue] = useState(initialAlt);
  const [saved, setSaved] = useState(false);

  return (
    <div className="flex items-start gap-3 px-3 py-2.5">
      <div className="shrink-0 w-14 h-14 rounded border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-100 dark:bg-gray-800 grid place-items-center text-[10px] text-gray-400">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
        ) : (
          "no src"
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate" title={src}>
          #{index + 1} · {src || "(không có src)"}
        </div>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => { setValue(e.target.value); setSaved(false); }}
            placeholder="Mô tả ngắn về ảnh…"
            disabled={readOnly}
            className="flex-1 h-8 px-2 rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-[13px] text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-brand"
          />
          {!readOnly && (
            <button
              type="button"
              onClick={() => { onSave(value.trim()); setSaved(true); setTimeout(() => setSaved(false), 1500); }}
              disabled={!value.trim()}
              className="h-8 px-3 rounded text-[12px] font-semibold bg-brand text-white hover:bg-brand-dark disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saved ? "✓ Đã lưu" : "Lưu alt"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
