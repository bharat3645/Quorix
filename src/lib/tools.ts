// Real, local, zero-dependency tool implementations. No network calls, no secrets.
// Each tool is pure/synchronous so it can be unit-tested and reasoned about easily.

export class ToolError extends Error {}

// ---------------------------------------------------------------------------
// Calculator: small recursive-descent parser/evaluator. No eval() anywhere.
// Grammar:
//   expr   := term (('+' | '-') term)*
//   term   := pow (('*' | '/' | '%') pow)*
//   pow    := unary ('^' pow)?           (right-associative)
//   unary  := ('-' | '+') unary | primary
//   primary:= NUMBER | '(' expr ')'
// ---------------------------------------------------------------------------

type Token = { type: 'num'; value: number } | { type: 'op'; value: string };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < input.length && /[0-9.]/.test(input[j])) j++;
      const numStr = input.slice(i, j);
      if ((numStr.match(/\./g) || []).length > 1) {
        throw new ToolError(`Invalid number "${numStr}"`);
      }
      tokens.push({ type: 'num', value: parseFloat(numStr) });
      i = j;
      continue;
    }
    if ('+-*/%^()'.includes(c)) {
      tokens.push({ type: 'op', value: c });
      i++;
      continue;
    }
    throw new ToolError(`Unexpected character "${c}"`);
  }
  return tokens;
}

function parseExpression(tokens: Token[]): number {
  let pos = 0;
  const peek = () => tokens[pos];
  const advance = () => tokens[pos++];

  function parsePrimary(): number {
    const t = peek();
    if (!t) throw new ToolError('Unexpected end of expression');
    if (t.type === 'num') {
      advance();
      return t.value;
    }
    if (t.type === 'op' && t.value === '(') {
      advance();
      const v = parseExpr();
      const close = advance();
      if (!close || close.value !== ')') throw new ToolError('Missing closing parenthesis');
      return v;
    }
    throw new ToolError(`Unexpected token "${t.value}"`);
  }

  function parseUnary(): number {
    const t = peek();
    if (t && t.type === 'op' && (t.value === '-' || t.value === '+')) {
      advance();
      const v = parseUnary();
      return t.value === '-' ? -v : v;
    }
    return parsePrimary();
  }

  function parsePow(): number {
    const base = parseUnary();
    const t = peek();
    if (t && t.type === 'op' && t.value === '^') {
      advance();
      const exp = parsePow();
      return Math.pow(base, exp);
    }
    return base;
  }

  function parseTerm(): number {
    let v = parsePow();
    for (;;) {
      const t = peek();
      if (t && t.type === 'op' && (t.value === '*' || t.value === '/' || t.value === '%')) {
        advance();
        const rhs = parsePow();
        if (t.value === '*') v = v * rhs;
        else if (t.value === '/') {
          if (rhs === 0) throw new ToolError('Division by zero');
          v = v / rhs;
        } else v = v % rhs;
      } else break;
    }
    return v;
  }

  function parseExpr(): number {
    let v = parseTerm();
    for (;;) {
      const t = peek();
      if (t && t.type === 'op' && (t.value === '+' || t.value === '-')) {
        advance();
        const rhs = parseTerm();
        v = t.value === '+' ? v + rhs : v - rhs;
      } else break;
    }
    return v;
  }

  const result = parseExpr();
  if (pos < tokens.length) throw new ToolError(`Unexpected trailing token "${tokens[pos].value}"`);
  return result;
}

export function calculate(input: string): number {
  const tokens = tokenize(input);
  if (tokens.length === 0) throw new ToolError('Empty expression');
  return parseExpression(tokens);
}

// ---------------------------------------------------------------------------
// Unit conversion: length, weight, temperature. Base-unit scaling + aliases.
// ---------------------------------------------------------------------------

const LENGTH: Record<string, number> = {
  m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.344, yd: 0.9144, ft: 0.3048, in: 0.0254,
};
const WEIGHT: Record<string, number> = {
  kg: 1, g: 0.001, mg: 0.000001, lb: 0.45359237, oz: 0.028349523125, t: 1000,
};
const TEMP_UNITS = ['c', 'f', 'k'];

const UNIT_ALIASES: Record<string, string> = {
  m: 'm', meter: 'm', meters: 'm', metre: 'm', metres: 'm',
  km: 'km', kilometer: 'km', kilometers: 'km', kilometre: 'km', kilometres: 'km',
  cm: 'cm', centimeter: 'cm', centimeters: 'cm',
  mm: 'mm', millimeter: 'mm', millimeters: 'mm',
  mi: 'mi', mile: 'mi', miles: 'mi',
  yd: 'yd', yard: 'yd', yards: 'yd',
  ft: 'ft', foot: 'ft', feet: 'ft',
  in: 'in', inch: 'in', inches: 'in',
  kg: 'kg', kilogram: 'kg', kilograms: 'kg',
  g: 'g', gram: 'g', grams: 'g',
  mg: 'mg', milligram: 'mg', milligrams: 'mg',
  lb: 'lb', lbs: 'lb', pound: 'lb', pounds: 'lb',
  oz: 'oz', ounce: 'oz', ounces: 'oz',
  t: 't', ton: 't', tonne: 't', tonnes: 't',
  c: 'c', celsius: 'c',
  f: 'f', fahrenheit: 'f',
  k: 'k', kelvin: 'k',
};

export function normalizeUnit(u: string): string {
  const key = u.trim().toLowerCase();
  const norm = UNIT_ALIASES[key];
  if (!norm) throw new ToolError(`Unknown unit "${u}"`);
  return norm;
}

function toCelsius(value: number, unit: string): number {
  switch (unit) {
    case 'c': return value;
    case 'f': return ((value - 32) * 5) / 9;
    case 'k': return value - 273.15;
    default: throw new ToolError(`Unknown temperature unit "${unit}"`);
  }
}

function fromCelsius(celsius: number, unit: string): number {
  switch (unit) {
    case 'c': return celsius;
    case 'f': return (celsius * 9) / 5 + 32;
    case 'k': return celsius + 273.15;
    default: throw new ToolError(`Unknown temperature unit "${unit}"`);
  }
}

export interface ConversionResult {
  result: number;
  fromUnit: string;
  toUnit: string;
}

export function convertUnits(value: number, fromRaw: string, toRaw: string): ConversionResult {
  const from = normalizeUnit(fromRaw);
  const to = normalizeUnit(toRaw);

  if (TEMP_UNITS.includes(from) || TEMP_UNITS.includes(to)) {
    if (!TEMP_UNITS.includes(from) || !TEMP_UNITS.includes(to)) {
      throw new ToolError(`Cannot convert between "${fromRaw}" and "${toRaw}"`);
    }
    return { result: fromCelsius(toCelsius(value, from), to), fromUnit: from, toUnit: to };
  }
  if (from in LENGTH && to in LENGTH) {
    return { result: (value * LENGTH[from]) / LENGTH[to], fromUnit: from, toUnit: to };
  }
  if (from in WEIGHT && to in WEIGHT) {
    return { result: (value * WEIGHT[from]) / WEIGHT[to], fromUnit: from, toUnit: to };
  }
  throw new ToolError(`Cannot convert between "${fromRaw}" and "${toRaw}" (different or unknown unit categories)`);
}

// ---------------------------------------------------------------------------
// JSON formatter / validator
// ---------------------------------------------------------------------------

export interface JsonFormatResult {
  valid: boolean;
  output: string;
  error?: string;
}

export function formatJson(input: string): JsonFormatResult {
  try {
    const parsed = JSON.parse(input);
    return { valid: true, output: JSON.stringify(parsed, null, 2) };
  } catch (e) {
    return { valid: false, output: '', error: e instanceof Error ? e.message : String(e) };
  }
}

// ---------------------------------------------------------------------------
// Text analysis
// ---------------------------------------------------------------------------

export interface TextStats {
  words: number;
  chars: number;
  charsNoSpaces: number;
  lines: number;
  sentences: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed.length ? trimmed.split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.length ? text.split(/\n/).length : 0;
  const sentences = trimmed.length ? (trimmed.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0;
  return { words, chars, charsNoSpaces, lines, sentences };
}

// ---------------------------------------------------------------------------
// Password generator
// ---------------------------------------------------------------------------

export interface PasswordOptions {
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
}

export function generatePassword(length: number, opts: PasswordOptions): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = lower.toUpperCase();
  const digits = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let pool = '';
  if (opts.lower) pool += lower;
  if (opts.upper) pool += upper;
  if (opts.digits) pool += digits;
  if (opts.symbols) pool += symbols;
  if (!pool) throw new ToolError('At least one character set must be enabled');

  // Prefer a CSPRNG when available (browser Web Crypto); fall back to Math.random.
  const bytes = new Uint32Array(length);
  const cryptoObj: Crypto | undefined = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoObj?.getRandomValues) {
    cryptoObj.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 0xffffffff);
  }

  let out = '';
  for (let i = 0; i < length; i++) {
    out += pool[bytes[i] % pool.length];
  }
  return out;
}

// ---------------------------------------------------------------------------
// UUID
// ---------------------------------------------------------------------------

export function generateUUID(): string {
  const cryptoObj: Crypto | undefined = typeof crypto !== 'undefined' ? crypto : undefined;
  if (cryptoObj?.randomUUID) return cryptoObj.randomUUID();
  // RFC 4122 v4 fallback for environments without crypto.randomUUID.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ---------------------------------------------------------------------------
// Clock / timezone lookup
// ---------------------------------------------------------------------------

const CITY_TIMEZONES: Record<string, string> = {
  tokyo: 'Asia/Tokyo', japan: 'Asia/Tokyo',
  london: 'Europe/London', uk: 'Europe/London',
  paris: 'Europe/Paris', france: 'Europe/Paris',
  berlin: 'Europe/Berlin', germany: 'Europe/Berlin',
  'new york': 'America/New_York', nyc: 'America/New_York',
  'los angeles': 'America/Los_Angeles', la: 'America/Los_Angeles',
  chicago: 'America/Chicago',
  mumbai: 'Asia/Kolkata', delhi: 'Asia/Kolkata', bangalore: 'Asia/Kolkata', india: 'Asia/Kolkata',
  dubai: 'Asia/Dubai',
  singapore: 'Asia/Singapore',
  beijing: 'Asia/Shanghai', shanghai: 'Asia/Shanghai', china: 'Asia/Shanghai',
  moscow: 'Europe/Moscow',
  'sao paulo': 'America/Sao_Paulo', brazil: 'America/Sao_Paulo',
  sydney: 'Australia/Sydney', australia: 'Australia/Sydney',
  utc: 'UTC', gmt: 'UTC',
};

export interface ClockResult {
  label: string;
  formatted: string;
  timeZone: string;
}

export function getClock(query?: string): ClockResult {
  const now = new Date();
  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  let label = 'your local time';

  if (query) {
    const needle = query.toLowerCase().trim();
    const match = Object.keys(CITY_TIMEZONES).find((city) => needle.includes(city));
    if (match) {
      timeZone = CITY_TIMEZONES[match];
      label = match.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }

  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone,
    dateStyle: 'full',
    timeStyle: 'long',
  }).format(now);

  return { label, formatted, timeZone };
}

export const SUPPORTED_CITIES = Object.keys(CITY_TIMEZONES);
