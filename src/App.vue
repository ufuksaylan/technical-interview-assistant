<script setup lang="ts">
import { CodeEditor } from 'monaco-editor-vue3'
import { useCodeEditorStore } from '@/stores/codeEditor'

const codeEditorStore = useCodeEditorStore()
</script>

<template>
  <div class="app">
    <header>
      <h1>Technical Interview Assistant</h1>
      <p>Code editor powered by Monaco Editor</p>
    </header>

    <main>
      <div class="editor-container">
        <CodeEditor
          v-model:value="codeEditorStore.code"
          language="ruby"
          theme="vs-dark"
          :options="codeEditorStore.editorOptions"
        />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: #1e1e1e;
  color: #ffffff;
}

header {
  padding: 2rem;
  text-align: center;
  background: #252526;
  border-bottom: 1px solid #3e3e42;
}

header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

header p {
  margin: 0;
  color: #cccccc;
  font-size: 1.1rem;
}

main {
  padding: 1rem;
}

.editor-container {
  height: 500px;
  border: 1px solid #3e3e42;
  border-radius: 4px;
  overflow: hidden;
}
</style>
