export type ChatMessageRole = 'system' | 'user' | 'assistant' | 'error'

export interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: string
  createdAt: Date
  pending?: boolean
}

