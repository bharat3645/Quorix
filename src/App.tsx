import { useEffect, useRef, useState } from 'react';
import { Moon, Sun, Settings as SettingsIcon, ExternalLink } from 'lucide-react';
import type { ChatMessage, ProviderSettings } from './types';
import { DEFAULT_PROVIDER_SETTINGS } from './types';
import { planLocalTurn, simulateStream, streamFromProvider } from './lib/agent';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ChatWindow } from './components/ChatWindow';
import { Composer } from './components/Composer';
import { SettingsPanel } from './components/SettingsPanel';

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useLocalStorage<ProviderSettings>('quorix:provider-settings', DEFAULT_PROVIDER_SETTINGS);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('quorix:dark-mode', true);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { id: newId('user'), role: 'user', content: trimmed, createdAt: Date.now() };
    const assistantId = newId('assistant');
    const assistantMessage: ChatMessage = {
      id: assistantId, role: 'assistant', content: '', createdAt: Date.now(), streaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput('');
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    function updateAssistant(patch: Partial<ChatMessage>) {
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, ...patch } : m)));
    }

    try {
      if (settings.enabled && settings.apiKey) {
        const history = [...messages, userMessage]
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role, content: m.content }));

        await streamFromProvider(settings, history, (partial) => updateAssistant({ content: partial }), controller.signal);
      } else {
        const { toolInvocation, replyText } = planLocalTurn(trimmed);
        if (toolInvocation) updateAssistant({ toolInvocation });
        await simulateStream(replyText, (partial) => updateAssistant({ content: partial }), { signal: controller.signal });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      updateAssistant({ content: `Something went wrong: ${message}` });
    } finally {
      updateAssistant({ streaming: false });
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
            Q
          </div>
          <div>
            <h1 className="text-sm font-semibold leading-none text-slate-800 dark:text-slate-100">Quorix</h1>
            <p className="text-[11px] leading-none text-slate-400 dark:text-slate-500">Agent Console</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="https://github.com/bharat3645/Quorix"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="View source on GitHub"
          >
            <ExternalLink size={16} />
          </a>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Open settings"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <ChatWindow messages={messages} onExampleClick={(text) => send(text)} />
      </main>

      <Composer value={input} onChange={setInput} onSend={() => send(input)} onStop={stop} isStreaming={isStreaming} />

      <SettingsPanel open={settingsOpen} settings={settings} onChange={setSettings} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
