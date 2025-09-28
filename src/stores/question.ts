import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadQuestions } from '@/services/questionService'
import type { Question } from '@/services/questionService'

export const useQuestionStore = defineStore('question', () => {
  const questions = ref<Question[]>([])
  const currentIndex = ref(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

  async function fetchQuestions() {
    if (isLoading.value || questions.value.length > 0) return

    isLoading.value = true
    error.value = null

    try {
      questions.value = await loadQuestions()
      currentIndex.value = 0
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load questions'
    } finally {
      isLoading.value = false
    }
  }

  function selectQuestion(index: number) {
    if (index >= 0 && index < questions.value.length) {
      currentIndex.value = index
    }
  }

  return {
    questions,
    currentIndex,
    currentQuestion,
    isLoading,
    error,
    fetchQuestions,
    selectQuestion,
  }
})
