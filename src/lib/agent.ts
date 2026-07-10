// The "agent" here is intentionally simple and fully local: a small intent
// router that recognizes a handful of patterns and dispatches to a real tool
// in ./tools.ts. There is no hidden network call and nothing is fabricated —
// see README.md for exactly what this does and does not do.

import {
  calculate,
  convertUnits,
  formatJson,
  analyzeText,
  generatePassword,
  generateUUID,
  getClock,
  ToolError,
} from './tools';
import type { ProviderSettings, ToolInvocation } from '../types';

export interface ToolMeta {
  id: string;
  label: string;
  examples: string[];
}

export const AVAILABLE_TOOLS: ToolMeta[] = [
  { id: 'calculator', label: 'Calculator', examples: ['2 + 2 * 10', 'calculate (12 - 4) / 2'] },
  { id: 'convert', label: 'Unit converter', examples: ['convert 10 km to miles', 'convert 100 f to c'] },
  { id: 'json', label: 'JSON formatter', examples: ['{"hello":"world","n":1}'] },
  { id: 'wordcount', label: 'Word counter', examples: ['word count: the quick brown fox'] },
  { id: 'uuid', label: 'UUID generator', examples: ['generate uuid'] },
  { id: 'password', label: 'Password generator', examples: ['generate a password', 'password 32'] },
  { id: 'clock', label: 'Clock / timezone', examples: ['what time is it in Tokyo'] },
];

interface RouteMatch {
  toolId: string;
  arg: string;
}

function looksLikeMath(input: string): boolean {
  const stripped = input.replace(/^calc(?:ulate)?[:\s]+/i, '').trim();
  if (!stripped) return false;
  if (!/[0-9]/.test(stripped)) return false;
  if (!/[+\-*/^%]/.test(stripped)) return false;
  return /^[\s\d+\-*/^%.()]+$/.test(stripped);
}

function extractMathExpr(input: string): string {
  return input.trim().replace(/^calc(?:ulate)?[:\s]+/i, '');
}

const CONVERT_RE = /convert\s+(-?[\d.]+)\s*([a-zA-Z]+)\s+(?:to|in)\s+([a-zA-Z]+)/i;
const PASSWORD_LEN_RE = /password\D*(\d{1,3})/i;

function route(input: string): RouteMatch | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  if (looksLikeMath(trimmed)) return { toolId: 'calculator', arg: extractMathExpr(trimmed) };

  const convMatch = trimmed.match(CONVERT_RE);
  if (convMatch) return { toolId: 'convert', arg: trimmed };

  if (/^\{[\s\S]*\}$|^\[[\s\S]*\]$/.test(trimmed)) return { toolId: 'json', arg: trimmed };

  if (/^(uuid|generate uuid|new uuid)$/i.test(trimmed)) return { toolId: 'uuid', arg: trimmed };

  if (/password/i.test(trimmed)) return { toolId: 'password', arg: trimmed };

  if (/\b(time|date|clock)\b/i.test(trimmed)) return { toolId: 'clock', arg: trimmed };

  if (/word count|count words|how many words/i.test(trimmed)) return { toolId: 'wordcount', arg: trimmed };

  return null;
}

function runTool(match: RouteMatch): ToolInvocation {
  const id = `tool-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    switch (match.toolId) {
      case 'calculator': {
        const result = calculate(match.arg);
        return {
          id, toolId: match.toolId, label: 'Calculator',
          detail: match.arg, output: String(result), ok: true,
        };
      }
      case 'convert': {
        const m = match.arg.match(CONVERT_RE);
        if (!m) throw new ToolError('Could not parse a conversion from that input.');
        const [, valueStr, from, to] = m;
        const { result, fromUnit, toUnit } = convertUnits(parseFloat(valueStr), from, to);
        return {
          id, toolId: match.toolId, label: 'Unit converter',
          detail: `${valueStr} ${from} → ${to}`,
          output: `${valueStr} ${fromUnit} = ${result.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${toUnit}`,
          ok: true,
        };
      }
      case 'json': {
        const res = formatJson(match.arg);
        if (!res.valid) throw new ToolError(res.error || 'Invalid JSON');
        return { id, toolId: match.toolId, label: 'JSON formatter', detail: 'input', output: res.output, ok: true };
      }
      case 'wordcount': {
        const stats = analyzeText(match.arg);
        return {
          id, toolId: match.toolId, label: 'Word counter', detail: match.arg,
          output: `${stats.words} words · ${stats.chars} characters · ${stats.sentences} sentence(s) · ${stats.lines} line(s)`,
          ok: true,
        };
      }
      case 'uuid': {
        return { id, toolId: match.toolId, label: 'UUID generator', detail: 'v4', output: generateUUID(), ok: true };
      }
      case 'password': {
        const lenMatch = match.arg.match(PASSWORD_LEN_RE);
        const length = lenMatch ? Math.min(128, Math.max(4, parseInt(lenMatch[1], 10))) : 20;
        const pw = generatePassword(length, { lower: true, upper: true, digits: true, symbols: true });
        return { id, toolId: match.toolId, label: 'Password generator', detail: `${length} characters`, output: pw, ok: true };
      }
      case 'clock': {
        const clock = getClock(match.arg);
        return {
          id, toolId: match.toolId, label: 'Clock', detail: clock.label,
          output: `${clock.formatted} (${clock.timeZone})`, ok: true,
        };
      }
      default:
        throw new ToolError(`Unknown tool "${match.toolId}"`);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { id, toolId: match.toolId, label: match.toolId, detail: match.arg, output: `Error: ${message}`, ok: false };
  }
}

const CANNED_RESPONSES: Array<{ pattern: RegExp; reply: string }> = [
  { pattern: /^(hi|hello|hey)\b/i, reply: "Hi! I'm the local Quorix demo agent. Try asking me to calculate something, convert units, format JSON, count words, generate a UUID or password, or check the time somewhere." },
  { pattern: /what can you do|help|capabilities/i, reply: "I can run a few real local tools: a calculator, a unit converter, a JSON formatter, a word counter, a UUID generator, a password generator, and a world clock. Type something like \"convert 10 km to miles\" and I'll show you exactly which tool ran and what it returned. Add your own API key in Settings to route open-ended questions to a real model instead of this canned response." },
  { pattern: /who (are|made) you|about quorix/i, reply: 'Quorix is a small reference app for 2026-era agentic UI patterns: streaming responses, inline tool-call visualization, and generative UI — built with a handful of tools that actually run locally, no backend required.' },
];

const DEFAULT_REPLY =
  "I didn't recognize a local tool for that. I can do math, unit conversions, JSON formatting, word counts, UUIDs, passwords, and world clock lookups — or add your own API key in Settings so open-ended questions go to a real model.";

function pickCannedReply(input: string): string {
  const found = CANNED_RESPONSES.find((c) => c.pattern.test(input.trim()));
  return found ? found.reply : DEFAULT_REPLY;
}

export interface AgentTurnResult {
  toolInvocation?: ToolInvocation;
  replyText: string;
}

/** Decide what to do with a user message when running in fully-local demo mode. */
export function planLocalTurn(input: string): AgentTurnResult {
  const match = route(input);
  if (!match) return { replyText: pickCannedReply(input) };

  const invocation = runTool(match);
  if (!invocation.ok) {
    return { toolInvocation: invocation, replyText: `That tool hit an error — see the card above. (${invocation.output})` };
  }
  return { toolInvocation: invocation, replyText: invocation.output };
}

/** Reveal one word/token at a time so the UI can render a live streaming effect. */
export async function simulateStream(
  text: string,
  onChunk: (partial: string) => void,
  opts: { signal?: AbortSignal; delayMs?: number } = {},
): Promise<void> {
  const delay = opts.delayMs ?? 18;
  const parts = text.split(/(\s+)/); // keep whitespace so words re-join correctly
  let acc = '';
  for (const part of parts) {
    if (opts.signal?.aborted) return;
    acc += part;
    onChunk(acc);
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

/**
 * Optional "bring your own key" mode: streams a real completion from an
 * OpenAI-compatible /chat/completions endpoint (OpenAI, OpenRouter, Groq,
 * and most local servers like Ollama/LM Studio implement this shape).
 * The key is read from ProviderSettings (persisted only in localStorage by
 * the caller) and sent directly to `baseUrl` — never anywhere else.
 */
export async function streamFromProvider(
  settings: ProviderSettings,
  history: Array<{ role: 'user' | 'assistant'; content: string }>,
  onChunk: (partial: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const res = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({ model: settings.model, messages: history, stream: true }),
    signal,
  });

  if (!res.ok || !res.body) {
    const bodyText = await res.text().catch(() => '');
    throw new Error(`Provider request failed (${res.status}): ${bodyText || res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let acc = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (payload === '[DONE]') return;
      try {
        const json = JSON.parse(payload);
        const delta: string | undefined = json.choices?.[0]?.delta?.content;
        if (delta) {
          acc += delta;
          onChunk(acc);
        }
      } catch {
        // Ignore malformed/partial SSE chunks; the next chunk usually completes them.
      }
    }
  }
}
