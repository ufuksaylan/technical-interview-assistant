import { computed, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { OpenAIService, createConversation } from '@/services/openai'
import { loadPrompt } from '@/services/promptLoader'
import { useCodeEditorStore } from '@/stores/codeEditor'
import { useExecutionStore } from '@/stores/execution'
import type { ChatMessage } from '@/types/chat'
import type { OpenAIRole } from '@/types/openai'

const PROMPT_PATH = '/src/prompts/chat-coach.json'

let cachedPrompt: string | null = null

async function getSystemPrompt(): Promise<string> {
  if (cachedPrompt !== null) return cachedPrompt
  const { systemPrompt } = await loadPrompt(PROMPT_PATH)
  cachedPrompt = systemPrompt
  return cachedPrompt
}

async function buildContextPrompt(): Promise<string> {
  const [systemPrompt, codeEditorStore, executionStore] = [
    await getSystemPrompt(),
    useCodeEditorStore(),
    useExecutionStore(),
  ]

  const { code, language } = storeToRefs(codeEditorStore)
  const { currentResult, lastExecution, totalExecutions, successfulExecutions, failedExecutions } =
    storeToRefs(executionStore)

  const latestResult = currentResult.value ?? lastExecution.value?.result

  let executionSection = 'Latest execution: none yet.'
  if (latestResult) {
    const parts = [
      `Success: ${latestResult.success ? 'yes' : 'no'}`,
      latestResult.status ? `Status: ${latestResult.status}` : undefined,
      latestResult.time ? `Time: ${latestResult.time}s` : undefined,
      latestResult.memory ? `Memory: ${latestResult.memory} KB` : undefined,
      latestResult.output ? `Output:\n${latestResult.output}` : undefined,
      latestResult.error ? `Error:\n${latestResult.error}` : undefined,
    ].filter(Boolean)
    executionSection = parts.join('\n\n')
  }

  const statsSummary = `Total runs: ${totalExecutions.value} (pass: ${successfulExecutions.value}, fail: ${failedExecutions.value})`

  return [
    systemPrompt,
    '--- Editor State ---',
    `Language: ${language.value}`,
    `Code:\n${code.value || '(empty)'}`,
    '--- Execution Summary ---',
    statsSummary,
    executionSection,
  ].join('\n\n')
}

function now(): Date {
  return new Date()
}

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function toOpenAIRole(role: ChatMessage['role']): OpenAIRole {
  switch (role) {
    case 'assistant':
    case 'system':
    case 'user':
      return role
    default:
      return 'assistant'
  }
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([
    {
      id: generateId(),
      role: 'assistant',
      content: 'Hi! I can help you prep for technical interviews. Ask me for hints, feedback, or walkthroughs.',
      createdAt: now(),
    },
  ])

  const input = ref('')
  const isSending = ref(false)

  const canSend = computed(() => input.value.trim().length > 0 && !isSending.value)

  function appendMessage(message: ChatMessage) {
    messages.value.push(message)
  }

  async function sendMessage(text?: string) {
    const content = (text ?? input.value).trim()
    if (!content || isSending.value) return

    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: now(),
    }

    appendMessage(userMessage)
    input.value = ''
    isSending.value = true

    try {
      const contextPrompt = await buildContextPrompt()

      const entries = [
        { role: 'system' as OpenAIRole, text: contextPrompt },
        ...messages.value
          .filter(message => message.role !== 'error')
          .map(message => ({
            role: toOpenAIRole(message.role),
            text: message.content,
          })),
      ]

      const response = await OpenAIService.createChatResponse(createConversation(entries))
      const output = response.output.find(part => part.type === 'output_text')

      appendMessage({
        id: generateId(),
        role: 'assistant',
        content: output?.text?.trim() || 'I could not generate a response this time.',
        createdAt: now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong while contacting ChatGPT.'
      appendMessage({
        id: generateId(),
        role: 'error',
        content: message,
        createdAt: now(),
      })
    } finally {
      isSending.value = false
    }
  }

  function setInput(value: string) {
    input.value = value
  }

  function resetConversation() {
    messages.value = [
      {
        id: generateId(),
        role: 'assistant',
        content: 'Conversation reset. How can I assist you next?',
        createdAt: now(),
      },
    ]
    input.value = ''
  }

  return {
    messages,
    input,
    isSending,
    canSend,
    sendMessage,
    setInput,
    resetConversation,
  }
})
