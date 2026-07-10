export type Role = 'user' | 'assistant';

export interface ToolInvocation {
  id: string;
  toolId: string;
  label: string;
  detail: string;
  output: string;
  ok: boolean;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  streaming?: boolean;
  toolInvocation?: ToolInvocation;
}

export interface ProviderSettings {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export const DEFAULT_PROVIDER_SETTINGS: ProviderSettings = {
  enabled: false,
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: 'gpt-4o-mini',
};
