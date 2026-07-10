import { X, ShieldCheck } from 'lucide-react';
import type { ProviderSettings } from '../types';

export function SettingsPanel({
  open,
  settings,
  onChange,
  onClose,
}: {
  open: boolean;
  settings: ProviderSettings;
  onChange: (next: ProviderSettings) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-sm flex-col overflow-y-auto bg-white shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            aria-label="Close settings"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-sm dark:border-slate-800">
            <span className="text-slate-700 dark:text-slate-200">Use my own API key</span>
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => onChange({ ...settings, enabled: e.target.checked })}
              className="h-4 w-4 accent-indigo-600"
            />
          </label>

          <div className={settings.enabled ? '' : 'pointer-events-none opacity-40'}>
            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Base URL</label>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => onChange({ ...settings, baseUrl: e.target.value })}
              placeholder="https://api.openai.com/v1"
              className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">Model</label>
            <input
              type="text"
              value={settings.model}
              onChange={(e) => onChange({ ...settings, model: e.target.value })}
              placeholder="gpt-4o-mini"
              className="mb-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />

            <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400">API key</label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => onChange({ ...settings, apiKey: e.target.value })}
              placeholder="sk-…"
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div className="flex gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
            <ShieldCheck size={28} className="shrink-0 text-indigo-500" />
            <p>
              Stored only in this browser&apos;s <code>localStorage</code> and sent only directly to the base URL
              above, from your browser, when you enable this option. It is never sent anywhere else. Without a key,
              Quorix still runs fully — the built-in local tools work offline and open-ended chat falls back to a
              canned response.
            </p>
          </div>

          {settings.enabled && (
            <button
              type="button"
              onClick={() => onChange({ enabled: false, baseUrl: settings.baseUrl, apiKey: '', model: settings.model })}
              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
            >
              Clear key &amp; disable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
