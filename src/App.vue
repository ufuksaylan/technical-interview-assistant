<script setup lang="ts">
import CodeEditorWidget from '@/components/CodeEditorWidget.vue'
import InputWidget from '@/components/InputWidget.vue'
import OutputWidget from '@/components/OutputWidget.vue'
import ControlsWidget from '@/components/ControlsWidget.vue'
</script>

<template>
  <div class="app">
    <header>
      <h1>Technical Interview Assistant</h1>
      <p>Ruby code editor with live execution powered by Judge0</p>
    </header>

    <main>
      <ControlsWidget />
      
      <div class="workspace">
        <CodeEditorWidget />
        <div class="side-panel">
          <InputWidget />
          <OutputWidget />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
}

header {
  padding: 2rem;
  text-align: center;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  box-shadow: var(--el-box-shadow-light);
}

header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

header p {
  margin: 0;
  color: var(--el-text-color-regular);
  font-size: 1.1rem;
}

main {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.workspace {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  height: calc(100vh - 240px);
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .workspace {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    height: auto;
  }
  
  main {
    padding: 1rem;
    gap: 1rem;
  }
  
  .side-panel {
    gap: 1rem;
  }
}
</style>
