import { Calculator, ArrowLeftRight, Braces, Type, KeyRound, Clock, Wrench, AlertTriangle } from 'lucide-react';
import type { ToolInvocation } from '../types';

const ICONS: Record<string, typeof Wrench> = {
  calculator: Calculator,
  convert: ArrowLeftRight,
  json: Braces,
  wordcount: Type,
  uuid: KeyRound,
  password: KeyRound,
  clock: Clock,
};

export function ToolCallCard({ invocation }: { invocation: ToolInvocation }) {
  const Icon = ICONS[invocation.toolId] ?? Wrench;

  return (
    <div
      className={`mt-2 rounded-lg border text-sm ${
        invocation.ok
          ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60'
          : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-inherit px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
        {invocation.ok ? <Icon size={14} /> : <AlertTriangle size={14} className="text-red-500" />}
        <span>
          Ran <span className="font-semibold text-slate-700 dark:text-slate-200">{invocation.label}</span>
        </span>
        {invocation.detail && <span className="truncate text-slate-400 dark:text-slate-500">· {invocation.detail}</span>}
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words px-3 py-2 font-mono text-[13px] text-slate-700 dark:text-slate-200">
        {invocation.output}
      </pre>
    </div>
  );
}
