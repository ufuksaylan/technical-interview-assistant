import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Judge0Service, LANGUAGE_IDS } from '@/services/judge0'
import type { ExecutionResult } from '@/types/judge0'

export interface ExecutionHistory {
  id: string
  timestamp: Date
  code: string
  stdin: string
  result: ExecutionResult
  language: string
}

export const useExecutionStore = defineStore('execution', () => {
  // Current execution state
  const isExecuting = ref(false)
  const currentResult = ref<ExecutionResult | null>(null)
  
  // Execution history
  const history = ref<ExecutionHistory[]>([])
  const maxHistorySize = ref(50)

  // Computed properties
  const hasCurrentResult = computed(() => currentResult.value !== null)
  const executionSuccess = computed(() => currentResult.value?.success === true)
  const lastExecution = computed(() => history.value[0] || null)
  
  // Statistics
  const totalExecutions = computed(() => history.value.length)
  const successfulExecutions = computed(() => 
    history.value.filter(h => h.result.success).length
  )
  const failedExecutions = computed(() => 
    history.value.filter(h => !h.result.success).length
  )

  // Actions
  async function executeCode(code: string, stdin: string = '', language: string = 'ruby') {
    if (isExecuting.value) return currentResult.value

    isExecuting.value = true
    currentResult.value = null

    try {
      const languageId = getLanguageId(language)
      const result = await Judge0Service.createSubmissionAndWait({
        source_code: code,
        language_id: languageId,
        stdin: stdin || undefined,
      })

      currentResult.value = result
      
      // Add to history
      addToHistory({
        id: generateId(),
        timestamp: new Date(),
        code,
        stdin,
        result,
        language
      })

      return result
    } catch (error) {
      const errorResult: ExecutionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Execution failed'
      }
      
      currentResult.value = errorResult
      
      // Add error to history
      addToHistory({
        id: generateId(),
        timestamp: new Date(),
        code,
        stdin,
        result: errorResult,
        language
      })

      return errorResult
    } finally {
      isExecuting.value = false
    }
  }

  function addToHistory(execution: ExecutionHistory) {
    history.value.unshift(execution)
    
    // Maintain max history size
    if (history.value.length > maxHistorySize.value) {
      history.value = history.value.slice(0, maxHistorySize.value)
    }
    
    // Save to localStorage
    saveHistoryToStorage()
  }

  function clearCurrentResult() {
    currentResult.value = null
  }

  function clearHistory() {
    history.value = []
    saveHistoryToStorage()
  }

  function removeFromHistory(id: string) {
    history.value = history.value.filter(h => h.id !== id)
    saveHistoryToStorage()
  }

  function getExecutionById(id: string) {
    return history.value.find(h => h.id === id)
  }

  // Restore execution as current result
  function restoreExecution(id: string) {
    const execution = getExecutionById(id)
    if (execution) {
      currentResult.value = execution.result
    }
  }

  // Language mapping
  function getLanguageId(language: string): number {
    const langMap: Record<string, number> = {
      'ruby': LANGUAGE_IDS.RUBY,
      'python': LANGUAGE_IDS.PYTHON,
      'javascript': LANGUAGE_IDS.JAVASCRIPT,
      'typescript': LANGUAGE_IDS.TYPESCRIPT,
      'java': LANGUAGE_IDS.JAVA,
      'cpp': LANGUAGE_IDS['C++'],
      'c': LANGUAGE_IDS.C,
      'csharp': LANGUAGE_IDS['C#'],
      'go': LANGUAGE_IDS.GO,
      'rust': LANGUAGE_IDS.RUST,
      'php': LANGUAGE_IDS.PHP,
    }
    return langMap[language] || LANGUAGE_IDS.RUBY
  }

  // Persistence
  function saveHistoryToStorage() {
    try {
      const serializedHistory = history.value.map(h => ({
        ...h,
        timestamp: h.timestamp.toISOString()
      }))
      localStorage.setItem('execution-history', JSON.stringify(serializedHistory))
    } catch (error) {
      console.warn('Failed to save execution history to localStorage:', error)
    }
  }

  function loadHistoryFromStorage() {
    try {
      const stored = localStorage.getItem('execution-history')
      if (stored) {
        const parsed = JSON.parse(stored)
        history.value = parsed.map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }))
      }
    } catch (error) {
      console.warn('Failed to load execution history from localStorage:', error)
      history.value = []
    }
  }

  // Utility
  function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Connection testing
  async function testConnection() {
    console.log('Testing Judge0 API connection...')
    const result = await Judge0Service.testConnection()
    console.log('Connection test result:', result)
    return result
  }

  // Initialize
  loadHistoryFromStorage()

  return {
    // State
    isExecuting,
    currentResult,
    history,
    maxHistorySize,
    
    // Computed
    hasCurrentResult,
    executionSuccess,
    lastExecution,
    totalExecutions,
    successfulExecutions,
    failedExecutions,
    
    // Actions
    executeCode,
    clearCurrentResult,
    clearHistory,
    removeFromHistory,
    getExecutionById,
    restoreExecution,
    testConnection,
    
    // Utils
    generateId
  }
})
