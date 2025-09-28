<template>
  <div :class="bubbleClass">
    <el-icon v-if="message.role === 'assistant'"><Message /></el-icon>
    <el-icon v-else-if="message.role === 'error'"><WarningFilled /></el-icon>

    <div class="bubble-content">
      <p>{{ message.content }}</p>
      <small>{{ formattedTime }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Message, WarningFilled } from '@element-plus/icons-vue'
import type { ChatMessage } from '@/types/chat'

const props = defineProps<{ message: ChatMessage }>()

const bubbleClass = computed(() => [
  'bubble',
  `bubble-${props.message.role === 'user' ? 'user' : props.message.role}`,
])

const formattedTime = computed(() =>
  new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(props.message.createdAt)
)
</script>

<style scoped>
.bubble {
  display: inline-flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  max-width: 100%;
  background: var(--el-color-info-light-9);
  color: var(--el-text-color-primary);
}

.bubble-user {
  align-self: flex-end;
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
}

.bubble-assistant {
  align-self: flex-start;
}

.bubble-error {
  align-self: flex-start;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.bubble :deep(p) {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.bubble :deep(small) {
  display: block;
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: var(--el-text-color-secondary);
}
</style>
