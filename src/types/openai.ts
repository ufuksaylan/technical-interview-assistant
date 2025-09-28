export type OpenAIRole = 'system' | 'user' | 'assistant' | 'tool'

export interface OpenAIInputTextContent {
  type: 'input_text'
  text: string
}

export interface OpenAIOutputTextContent {
  type: 'output_text'
  text: string
}

export interface OpenAIToolContent {
  type: 'tool_result'
  tool_call_id: string
  content: Array<OpenAIOutputTextContent>
}

export type OpenAIMessageContent = OpenAIInputTextContent | OpenAIToolContent

export interface OpenAIMessage {
  role: OpenAIRole
  content: OpenAIMessageContent[]
}

export interface CreateResponseRequest {
  model?: string
  input: OpenAIMessage[]
  metadata?: Record<string, unknown>
  response_format?: {
    type: 'text' | 'json_schema'
    json_schema?: {
      name: string
      schema: Record<string, unknown>
      strict?: boolean
    }
  }
  temperature?: number
  max_output_tokens?: number
  reasoning?: {
    effort?: 'low' | 'medium' | 'high'
  }
}

export interface ResponseOutputText {
  type: 'output_text'
  text: string
}

export interface ResponseOutputRefusal {
  type: 'refusal'
  refusal: {
    reason: string
    content?: string
  }
}

export type ResponseOutput = ResponseOutputText | ResponseOutputRefusal

export interface OpenAIResponse {
  id: string
  model: string
  created: number
  usage?: {
    input_text_tokens?: number
    output_text_tokens?: number
    total_tokens?: number
  }
  output: ResponseOutput[]
  status?: string
}

export interface OpenAIErrorResponse {
  error: {
    message: string
    type?: string
    param?: string | null
    code?: string | null
  }
}
