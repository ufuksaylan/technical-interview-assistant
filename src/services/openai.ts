import type {
  CreateResponseRequest,
  OpenAIErrorResponse,
  OpenAIResponse,
  OpenAIInputTextContent,
  OpenAIMessage,
  OpenAIRole,
  OpenAIMessageContent,
  OpenAIOutputTextContent,
} from '@/types/openai'

const DEFAULT_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o'
const BASE_URL = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1'

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) {
    throw new Error('Missing OpenAI API key. Set VITE_OPENAI_API_KEY in your environment.')
  }
  return key
}

async function apiRequest<T>(endpoint: string, options: RequestInit): Promise<T> {
  const apiKey = getApiKey()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    const error = data as OpenAIErrorResponse
    const message = error?.error?.message || `OpenAI request failed with status ${response.status}`
    throw new Error(message)
  }

  return data as T
}

type ChatCompletionRole = 'system' | 'user' | 'assistant' | 'tool'

interface ChatCompletionMessage {
  role: ChatCompletionRole
  content: string
}

interface ChatCompletionChoice {
  index: number
  finish_reason?: string | null
  message: {
    role: ChatCompletionRole
    content: string | null
  }
}

interface ChatCompletionResponse {
  id: string
  model: string
  created: number
  choices: ChatCompletionChoice[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

function flattenMessageContent(content: OpenAIMessageContent[]): string {
  return content
    .map(item => {
      if (item.type === 'input_text') {
        return item.text
      }

      if (item.type === 'tool_result') {
        const toolText = item.content
          .map((entry: OpenAIOutputTextContent) => entry.text)
          .filter(Boolean)
          .join('\n')
        return toolText ? `Tool(${item.tool_call_id}): ${toolText}` : `Tool(${item.tool_call_id})`
      }

      return ''
    })
    .filter(Boolean)
    .join('\n')
}

function toChatCompletionMessage(message: OpenAIMessage): ChatCompletionMessage {
  return {
    role: message.role as ChatCompletionRole,
    content: flattenMessageContent(message.content),
  }
}

function mapChatCompletionToResponse(response: ChatCompletionResponse): OpenAIResponse {
  const firstChoice = response.choices[0]
  const text = firstChoice?.message?.content ?? ''

  return {
    id: response.id,
    model: response.model,
    created: response.created,
    output: text ? [{ type: 'output_text', text }] : [],
    usage: response.usage
      ? {
          input_text_tokens: response.usage.prompt_tokens,
          output_text_tokens: response.usage.completion_tokens,
          total_tokens: response.usage.total_tokens,
        }
      : undefined,
    status: firstChoice?.finish_reason || undefined,
  }
}

export const OpenAIService = {
  async createResponse(params: CreateResponseRequest): Promise<OpenAIResponse> {
    const payload = {
      model: params.model || DEFAULT_MODEL,
      messages: params.input.map(toChatCompletionMessage),
      temperature: params.temperature,
      max_tokens: params.max_output_tokens,
    }

    const response = await apiRequest<ChatCompletionResponse>('/chat/completions', {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    return mapChatCompletionToResponse(response)
  },

  async createChatResponse(
    messages: CreateResponseRequest['input'],
    overrides?: Partial<CreateResponseRequest>
  ) {
    return this.createResponse({
      input: messages,
      ...overrides,
    })
  },
}

export function createInputText(text: string): OpenAIInputTextContent {
  return {
    type: 'input_text',
    text,
  }
}

export function createTextMessage(role: OpenAIRole, text: string): OpenAIMessage {
  return {
    role,
    content: [createInputText(text)],
  }
}

export function createConversation(
  entries: Array<{ role: OpenAIRole; text: string }>
): OpenAIMessage[] {
  return entries.map(entry => createTextMessage(entry.role, entry.text))
}

