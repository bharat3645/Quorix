import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Send, Square } from 'lucide-react';

export function Composer({
  value,
  onChange,
  onSend,
  onStop,
  isStreaming,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  isStreaming: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && value.trim()) onSend();
    }
  }

  return (
    <div className="border-t border-slate-200 bg-white/80 px-4 py-3 backdrop-blur sm:px-6 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask for a calculation, a unit conversion, a UUID, the time somewhere…"
          rows={1}
          className="max-h-40 min-h-[44px] flex-1 resize-none rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900/40"
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900"
            aria-label="Stop generating"
          >
            <Square size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        )}
      </div>
      <p className="mx-auto mt-1.5 max-w-3xl text-center text-[11px] text-slate-400 dark:text-slate-500">
        Enter to send · Shift+Enter for a new line
      </p>
    </div>
  );
}
