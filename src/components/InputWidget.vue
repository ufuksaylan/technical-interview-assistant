<template>
  <div class="input-widget">
    <div class="input-header">
      <el-icon><Edit /></el-icon>
      <h3>Input (stdin)</h3>
    </div>
    <el-input
      v-model="codeEditorStore.stdin"
      type="textarea"
      placeholder="Enter input for your program here..."
      :rows="6"
      resize="vertical"
      class="stdin-input"
    />
  </div>
</template>

<script setup lang="ts">
import { useCodeEditorStore } from '@/stores/codeEditor'
import { Edit } from '@element-plus/icons-vue'

const codeEditorStore = useCodeEditorStore()
</script>

<style scoped>
.input-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  padding: 1rem;
  box-shadow: var(--el-box-shadow-light);
}

.input-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.input-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 1.1rem;
}

.stdin-input {
  flex: 1;
}

:deep(.el-textarea__inner) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  min-height: 120px;
}
</style>
