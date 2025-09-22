<template>
  <div class="code-editor-widget">
    <div class="editor-header">
      <el-icon><Document /></el-icon>
      <h3>Code Editor</h3>
    </div>
    <el-card class="editor-card" body-style="padding: 0">
      <div class="editor-container">
        <CodeEditor
          v-model:value="codeEditorStore.code"
          language="ruby"
          theme="vs-dark"
          :options="codeEditorStore.editorOptions"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { CodeEditor } from 'monaco-editor-vue3'
import { useCodeEditorStore } from '@/stores/codeEditor'
import { Document } from '@element-plus/icons-vue'

const codeEditorStore = useCodeEditorStore()
</script>

<style scoped>
.code-editor-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.editor-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 1.1rem;
}

.editor-card {
  flex: 1;
  height: 100%;
}

.editor-container {
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
