<template>
  <div class="question-widget">
    <header>
      <div class="title">
        <el-icon><EditPen /></el-icon>
        <div>
          <h2>{{ question?.title ?? 'Loading question...' }}</h2>
          <small v-if="question">
            Question {{ currentIndex + 1 }} of {{ total }}
            <span v-if="question.language" class="language-pill">{{ question.language }}</span>
          </small>
        </div>
      </div>

      <el-select
        v-if="total > 1"
        v-model="selectedIndex"
        size="small"
        @change="handleSelect"
        placeholder="Choose question"
        class="question-select"
      >
        <el-option
          v-for="(item, index) in questions"
          :key="item.id"
          :label="`${index + 1}. ${item.title}`"
          :value="index"
        />
      </el-select>
    </header>

    <div class="content">
      <el-skeleton v-if="isLoading" :rows="4" animated />
      <el-alert v-else-if="error" type="error" :closable="false">
        {{ error }}
      </el-alert>
      <template v-else-if="question">
        <pre class="prompt">{{ question.prompt }}</pre>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { EditPen } from '@element-plus/icons-vue'
import { useQuestionStore } from '@/stores/question'

const questionStore = useQuestionStore()

const selectedIndex = ref(0)

const question = computed(() => questionStore.currentQuestion)
const questions = computed(() => questionStore.questions)
const currentIndex = computed(() => questionStore.currentIndex)
const total = computed(() => questionStore.questions.length)
const isLoading = computed(() => questionStore.isLoading)
const error = computed(() => questionStore.error)

function handleSelect(value: number) {
  questionStore.selectQuestion(value)
}

watch(currentIndex, (index) => {
  selectedIndex.value = index
})

onMounted(async () => {
  await questionStore.fetchQuestions()
  selectedIndex.value = questionStore.currentIndex
})
</script>

<style scoped>
.question-widget {
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 1px solid var(--el-border-color);
  padding: 1.5rem;
  box-shadow: var(--el-box-shadow-light);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.title {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.title h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--el-text-color-primary);
}

.title small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--el-text-color-secondary);
}

.language-pill {
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  background: var(--el-color-info-light-9);
  color: var(--el-color-info);
  font-size: 0.75rem;
}

.question-select {
  min-width: 220px;
}

.prompt {
  margin: 0;
  padding: 1rem;
  background: var(--el-color-info-light-9);
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  line-height: 1.6;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    align-items: flex-start;
  }

  .question-select {
    width: 100%;
  }
}
</style>
