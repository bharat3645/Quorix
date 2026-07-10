import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';

const EXAMPLE_PROMPTS = [
  '2 + 2 * 10',
  'convert 10 km to miles',
  '{"hello": "world", "n": 42}',
  'generate a password 24',
  'what time is it in Tokyo',
  'word count: the quick brown fox jumps',
];

export function ChatWindow({
  messages,
  onExampleClick,
}: {
  messages: ChatMessage[];
  onExampleClick: (text: string) => void;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
          <Sparkles size={22} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Quorix Agent Console</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            A small, local, real reference app for agentic UI patterns. Try one of these — each one runs an actual
            tool, not a canned answer.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onExampleClick(prompt)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 px-4 py-6 sm:px-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
