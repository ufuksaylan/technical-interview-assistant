<template>
  <div class="output-widget">
    <div class="output-header">
      <el-icon><Monitor /></el-icon>
      <h3>Output</h3>
    </div>
    
    <el-card class="output-card" body-style="padding: 0">
      <div v-if="executionStore.isExecuting" class="output-container executing">
        <el-loading-spinner />
        <p>Executing code...</p>
      </div>
      
      <div 
        v-else-if="executionStore.hasCurrentResult"
        class="output-container"
      >
        <div v-if="executionStore.currentResult?.output" class="output-content">
          <el-alert
            title="Output"
            type="success"
            :closable="false"
            class="result-alert"
          >
            <pre class="result-text">{{ executionStore.currentResult.output }}</pre>
          </el-alert>
        </div>
        
        <div v-if="executionStore.currentResult?.error" class="error-content">
          <el-alert
            title="Error"
            type="error"
            :closable="false"
            class="result-alert"
          >
            <pre class="result-text">{{ executionStore.currentResult.error }}</pre>
          </el-alert>
        </div>
        
        <div v-if="executionStore.currentResult?.time || executionStore.currentResult?.memory" class="metrics">
          <el-tag v-if="executionStore.currentResult.time" type="info" size="small">
            <el-icon><Timer /></el-icon>
            {{ executionStore.currentResult.time }}s
          </el-tag>
          <el-tag v-if="executionStore.currentResult.memory" type="info" size="small">
            <el-icon><Cpu /></el-icon>
            {{ executionStore.currentResult.memory }} KB
          </el-tag>
        </div>

        <div v-if="executionStore.totalExecutions > 0" class="execution-stats">
          <el-text size="small" type="info">
            Total: {{ executionStore.totalExecutions }} | 
            Success: {{ executionStore.successfulExecutions }} | 
            Failed: {{ executionStore.failedExecutions }}
          </el-text>
        </div>
      </div>
      
      <div v-else class="output-container empty">
        <el-empty description="Click 'Run Code' to execute your program" />
        <div v-if="executionStore.totalExecutions > 0" class="execution-stats">
          <el-text size="small" type="info">
            Total executions: {{ executionStore.totalExecutions }} | 
            Success: {{ executionStore.successfulExecutions }} | 
            Failed: {{ executionStore.failedExecutions }}
          </el-text>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useExecutionStore } from '@/stores/execution'
import { Monitor, Timer, Cpu } from '@element-plus/icons-vue'

const executionStore = useExecutionStore()
</script>

<style scoped>
.output-widget {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.output-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.output-header h3 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 1.1rem;
}

.output-card {
  flex: 1;
  height: 100%;
}

.output-container {
  padding: 1rem;
  height: 100%;
  overflow-y: auto;
  min-height: 200px;
}

.output-container.executing {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}

.output-container.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.result-alert {
  margin-bottom: 1rem;
}

.result-text {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: inherit;
}

.metrics {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.execution-stats {
  padding-top: 1rem;
  border-top: 1px solid var(--el-border-color-lighter);
  text-align: center;
}

:deep(.el-card__body) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.el-empty) {
  padding: 2rem 1rem;
}
</style>
