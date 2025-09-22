<template>
  <div class="controls-widget">
    <div class="control-group">
      <el-tag size="large" type="primary" round>
        <el-icon><Document /></el-icon>
        Ruby
      </el-tag>
    </div>

    <div class="control-group">
      <el-button 
        type="primary"
        @click="handleExecuteCode"
        :loading="executionStore.isExecuting"
        :disabled="executionStore.isExecuting"
        size="large"
      >
        <el-icon><VideoPlay /></el-icon>
        {{ executionStore.isExecuting ? 'Executing...' : 'Run Code' }}
      </el-button>
      
      <el-button 
        @click="codeEditorStore.resetCode"
        size="large"
      >
        <el-icon><RefreshLeft /></el-icon>
        Reset
      </el-button>

      <el-button 
        type="info"
        @click="executionStore.testConnection"
        size="large"
      >
        <el-icon><Connection /></el-icon>
        Test API
      </el-button>

      <el-button 
        type="danger"
        @click="executionStore.clearCurrentResult"
        size="large"
      >
        <el-icon><Delete /></el-icon>
        Clear Output
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCodeEditorStore } from '@/stores/codeEditor'
import { useExecutionStore } from '@/stores/execution'
import { Document, VideoPlay, RefreshLeft, Connection, Delete } from '@element-plus/icons-vue'

const codeEditorStore = useCodeEditorStore()
const executionStore = useExecutionStore()

async function handleExecuteCode() {
  const { code, stdin, language } = codeEditorStore.getEditorState()
  await executionStore.executeCode(code, stdin, language)
}
</script>

<style scoped>
.controls-widget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color);
  box-shadow: var(--el-box-shadow-light);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .controls-widget {
    flex-direction: column;
    gap: 1rem;
  }
  
  .control-group {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
