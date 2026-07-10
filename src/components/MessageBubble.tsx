import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '../types';
import { ToolCallCard } from './ToolCallCard';

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900'
        }`}
      >
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>
      <div className={`flex max-w-[80%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-indigo-600 text-white'
              : 'rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
          }`}
        >
          {message.content || ' '}
          {message.streaming && <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-current align-middle" />}
        </div>
        {message.toolInvocation && <ToolCallCard invocation={message.toolInvocation} />}
      </div>
    </div>
  );
}
