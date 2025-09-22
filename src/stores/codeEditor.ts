import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCodeEditorStore = defineStore('codeEditor', () => {
  // Editor state
  const code = ref(`def hello
  puts 'Hello, Monaco Editor Vue3!'
  'Welcome to the Technical Interview Assistant'
end

puts hello`)

  const stdin = ref('')
  const language = ref('ruby')

  const editorOptions = {
    fontSize: 14,
    minimap: { enabled: false },
    automaticLayout: true,
    theme: 'vs-dark'
  }

  // Editor actions
  function setCode(newCode: string) {
    code.value = newCode
  }

  function setStdin(input: string) {
    stdin.value = input
  }

  function setLanguage(newLanguage: string) {
    language.value = newLanguage
    updateCodeForLanguage(newLanguage)
  }

  function updateCodeForLanguage(lang: string) {
    if (lang === 'ruby') {
      code.value = `def hello
  puts 'Hello, Monaco Editor Vue3!'
  'Welcome to the Technical Interview Assistant'
end

puts hello`
    } else if (lang === 'python') {
      code.value = `def hello():
    print('Hello, Monaco Editor Vue3!')
    return 'Welcome to the Technical Interview Assistant'

print(hello())`
    } else if (lang === 'javascript') {
      code.value = `function hello() {
    console.log('Hello, Monaco Editor Vue3!');
    return 'Welcome to the Technical Interview Assistant';
}

console.log(hello());`
    }
  }

  function resetCode() {
    updateCodeForLanguage(language.value)
  }

  function clearStdin() {
    stdin.value = ''
  }

  function getEditorState() {
    return {
      code: code.value,
      stdin: stdin.value,
      language: language.value
    }
  }

  function restoreEditorState(state: { code: string; stdin: string; language: string }) {
    code.value = state.code
    stdin.value = state.stdin
    language.value = state.language
  }

  return {
    // State
    code,
    stdin,
    language,
    editorOptions,
    
    // Actions
    setCode,
    setStdin,
    setLanguage,
    resetCode,
    clearStdin,
    getEditorState,
    restoreEditorState
  }
})