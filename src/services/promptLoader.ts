export interface PromptConfig {
  systemPrompt: string
}

export async function loadPrompt(path: string): Promise<PromptConfig> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to load prompt at ${path}: ${response.status}`)
  }

  return response.json()
}

