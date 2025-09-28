<template>
  <div class="chat-widget">
    <header class="chat-header">
      <div class="title">
        <el-icon><ChatLineSquare /></el-icon>
        <h3>Interview Coach</h3>
      </div>
      <el-button 
        type="primary" 
        :disabled="chatStore.isSending"
        @click="chatStore.resetConversation"
        size="small"
        plain
      >
        Reset
      </el-button>
    </header>

    <el-card class="chat-card" body-style="padding: 0; height: 100%">
      <div class="chat-container">
        <el-scrollbar ref="scrollbarRef">
          <div class="messages">
            <ChatMessageBubble
              v-for="message in chatStore.messages"
              :key="message.id"
              :message="message"
            />
            <div v-if="chatStore.isSending" class="assistant-bubble typing">
              <span class="typing-dot" v-for="n in 3" :key="n"></span>
            </div>
          </div>
        </el-scrollbar>

        <footer class="composer">
          <el-input
            v-model="chatStore.input"
            type="textarea"
            :rows="3"
            placeholder="Ask for a hint, feedback, or next steps..."
            resize="none"
            @keydown.enter.prevent="handleSubmit"
          />

          <div class="composer-actions">
            <el-button
              type="primary"
              :loading="chatStore.isSending"
              :disabled="!chatStore.canSend"
              @click="handleSubmit"
            >
              <el-icon><Promotion /></el-icon>
              Send
            </el-button>
          </div>
        </footer>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ChatLineSquare, Promotion } from '@element-plus/icons-vue'
import { useChatStore } from '@/stores/chat'
import ChatMessageBubble from './ChatMessageBubble.vue'

const chatStore = useChatStore()

const scrollbarRef = ref<InstanceType<typeof import('element-plus')['ElScrollbar']> | null>(null)

function scrollToBottom() {
  requestAnimationFrame(() => {
    scrollbarRef.value?.setScrollTop(Number.POSITIVE_INFINITY)
  })
}

function handleSubmit() {
  chatStore.sendMessage()
}

watch(
  () => chatStore.messages.length,
  () => {
    scrollToBottom()
  },
  { immediate: true }
)

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-widget {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
  min-height: 420px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--el-box-shadow-light);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--el-border-color);
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--el-text-color-primary);
}

.chat-card {
  flex: 1;
  min-height: 0;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.25rem 1.25rem;
}

.composer {
  border-top: 1px solid var(--el-border-color);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--el-bg-color);
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
}

.assistant-bubble.typing {
  align-self: flex-start;
  display: inline-flex;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  border-radius: 16px;
  background: var(--el-color-info-light-9);
}

.typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--el-color-info);
  animation: typing 1.2s infinite ease-in-out;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.15s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .chat-widget {
    height: auto;
    min-height: 360px;
  }
}
</style>
