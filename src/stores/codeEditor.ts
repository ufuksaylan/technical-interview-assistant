import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCodeEditorStore = defineStore('codeEditor', () => {
  const code = ref(`def hello
  puts 'Hello, Monaco Editor Vue3!'
  'Welcome to the Technical Interview Assistant'
end

puts hello`)

  const editorOptions = {
    fontSize: 14,
    minimap: { enabled: false },
    automaticLayout: true,
    theme: 'vs-dark'
  }

  function setCode(newCode: string) {
    code.value = newCode
  }

  function resetCode() {
    code.value = `def hello
  puts 'Hello, Monaco Editor Vue3!'
  'Welcome to the Technical Interview Assistant'
end

puts hello`
  }

  return {
    code,
    editorOptions,
    setCode,
    resetCode
  }
})