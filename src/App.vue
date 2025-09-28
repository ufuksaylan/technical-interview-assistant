<script setup lang="ts">
import CodeEditorWidget from '@/components/CodeEditorWidget.vue'
import InputWidget from '@/components/InputWidget.vue'
import OutputWidget from '@/components/OutputWidget.vue'
import ControlsWidget from '@/components/ControlsWidget.vue'
import ChatWidget from '@/components/ChatWidget.vue'
</script>

<template>
  <div class="app">
    <header>
      <h1>Technical Interview Assistant</h1>
      <p>Ruby code editor with live execution powered by Judge0</p>
    </header>

    <main class="main-layout">
      <section class="workspace-area">
        <ControlsWidget />

        <div class="workspace-grid">
          <CodeEditorWidget />
          <div class="side-panel">
            <InputWidget />
            <OutputWidget />
          </div>
        </div>
      </section>

      <aside class="chat-area">
        <ChatWidget />
      </aside>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  display: flex;
  flex-direction: column;
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

.main-layout {
  flex: 1;
  padding: 1.5rem 2rem;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 2.2fr) minmax(0, 1fr);
  gap: 1.75rem;
  box-sizing: border-box;
}

.workspace-area {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 1.5rem;
  height: 100%;
  min-height: 460px;
}

.side-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 0;
}

.chat-area {
  min-height: 0;
}

@media (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 1fr;
    padding: 1.25rem 1.5rem;
  }

  .workspace-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    height: auto;
  }
}

@media (max-width: 768px) {
  header {
    padding: 1.5rem 1rem;
  }

  .main-layout {
    padding: 1rem;
    gap: 1rem;
  }

  .workspace-area {
    gap: 1rem;
  }

  .workspace-grid {
    gap: 1rem;
  }

  .side-panel {
    gap: 1rem;
  }
}
</style>
