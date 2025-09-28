import type { SubmissionRequest, Submission, Language, ExecutionResult } from '@/types/judge0'

const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY
const BASE_URL = `https://${RAPIDAPI_HOST}`

const headers = {
  'X-RapidAPI-Host': RAPIDAPI_HOST,
  'X-RapidAPI-Key': RAPIDAPI_KEY,
  'Content-Type': 'application/json',
}

export class Judge0Service {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Judge0 API Error:', error)
      throw error
    }
  }

  static async getLanguages(): Promise<Language[]> {
    return this.request<Language[]>('/languages')
  }

  static async getLanguage(id: number): Promise<Language> {
    return this.request<Language>(`/languages/${id}`)
  }

  static async createSubmission(submission: SubmissionRequest): Promise<Submission> {
    return this.request<Submission>('/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    })
  }

  static async getSubmission(token: string, fields?: string): Promise<Submission> {
    const params = fields ? `?fields=${encodeURIComponent(fields)}` : ''
    return this.request<Submission>(`/submissions/${token}${params}`)
  }

  static async createSubmissionAndWait(
    submission: SubmissionRequest,
    maxWaitTime: number = 10000
  ): Promise<ExecutionResult> {
    try {
      console.log('Creating submission with data:', submission)
      
      // Create submission
      const createdSubmission = await this.createSubmission(submission)
      console.log('Submission created:', createdSubmission)
      
      if (!createdSubmission.token) {
        throw new Error('No token received from submission')
      }

      // Poll for result
      const result = await this.pollForResult(createdSubmission.token, maxWaitTime)
      console.log('Final result:', result)
      return this.mapSubmissionToResult(result)
    } catch (error) {
      console.error('Error in createSubmissionAndWait:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  private static async pollForResult(
    token: string,
    maxWaitTime: number,
    interval: number = 1000
  ): Promise<Submission> {
    const startTime = Date.now()
    let attempts = 0
    
    while (Date.now() - startTime < maxWaitTime) {
      attempts++
      console.log(`Polling attempt ${attempts} for token ${token}`)
      
      try {
        const submission = await this.getSubmission(token)
        console.log(`Submission status:`, submission.status_id, submission.status?.description)
        
        // Status ID 1 = "In Queue", 2 = "Processing"
        // Anything else means it's done (success or error)
        const statusId = submission.status_id || submission.status?.id
        if (statusId && statusId > 2) {
          console.log('Execution completed:', submission)
          return submission
        }
        
        await new Promise(resolve => setTimeout(resolve, interval))
      } catch (error) {
        console.error(`Polling error on attempt ${attempts}:`, error)
        // Continue polling even if one request fails
        await new Promise(resolve => setTimeout(resolve, interval))
      }
    }
    
    console.error(`Polling timed out after ${maxWaitTime}ms and ${attempts} attempts`)
    throw new Error(`Execution timed out after ${maxWaitTime / 1000} seconds`)
  }

  private static mapSubmissionToResult(submission: Submission): ExecutionResult {
    // Status ID 3 = "Accepted" (successful execution)
    const statusId = submission.status_id || submission.status?.id
    const success = statusId === 3
    
    let output = submission.stdout || ''
    let error = submission.stderr || ''
    
    // Add compile output if there are compilation errors
    if (submission.compile_output) {
      if (error) {
        error += '\n\nCompilation Output:\n' + submission.compile_output
      } else {
        error = 'Compilation Output:\n' + submission.compile_output
      }
    }
    
    // Add status message if there's an error
    if (!success && submission.message) {
      error = error ? `${error}\n\nStatus: ${submission.message}` : submission.message
    }
    
    return {
      success,
      output: output || undefined,
      error: error || undefined,
      time: submission.time || undefined,
      memory: submission.memory || undefined,
      status: submission.status?.description || undefined,
      compile_output: submission.compile_output || undefined
    }
  }

  static async getAbout() {
    return this.request('/about')
  }

  static async getStatuses() {
    return this.request('/statuses')
  }

  // Test connection to Judge0 API
  static async testConnection(): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const about = await this.getAbout()
      return {
        success: true,
        message: 'Successfully connected to Judge0 API',
        data: about
      }
    } catch (error) {
      console.error('Judge0 connection test failed:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection test failed'
      }
    }
  }
}

// Common language IDs for Judge0
export const LANGUAGE_IDS = {
  BASH: 46,
  C: 50,
  'C++': 54,
  'C#': 51,
  CLOJURE: 86,
  COBOL: 77,
  'COMMON_LISP': 55,
  D: 56,
  ELIXIR: 57,
  ERLANG: 58,
  EXECUTABLE: 44,
  'F#': 87,
  FORTRAN: 59,
  GO: 60,
  GROOVY: 88,
  HASKELL: 61,
  JAVA: 62,
  JAVASCRIPT: 63,
  KOTLIN: 78,
  LUA: 64,
  'OBJECTIVE-C': 79,
  OCAML: 65,
  OCTAVE: 66,
  PASCAL: 67,
  PERL: 85,
  PHP: 68,
  'PLAIN_TEXT': 43,
  PROLOG: 69,
  PYTHON: 71,
  R: 80,
  RUBY: 72,
  RUST: 73,
  SCALA: 81,
  SQL: 82,
  SWIFT: 83,
  TYPESCRIPT: 74,
  'VISUAL_BASIC': 84,
} as const
