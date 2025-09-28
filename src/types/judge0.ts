export interface Language {
  id: number
  name: string
  is_archived: boolean
  source_file: string
  compile_cmd?: string
  run_cmd?: string
}

export interface SubmissionRequest {
  source_code: string
  language_id: number
  stdin?: string
  expected_output?: string
  cpu_time_limit?: number
  cpu_extra_time?: number
  wall_time_limit?: number
  memory_limit?: number
  stack_limit?: number
  max_processes_and_or_threads?: number
  enable_per_process_and_thread_time_limit?: boolean
  enable_per_process_and_thread_memory_limit?: boolean
  max_file_size?: number
  enable_network?: boolean
  number_of_runs?: number
  redirect_stderr_to_stdout?: boolean
  callback_url?: string
  compiler_options?: string
  command_line_arguments?: string
}

export interface Submission {
  token?: string
  source_code?: string
  language_id?: number
  stdin?: string
  expected_output?: string
  stdout?: string
  status_id?: number
  created_at?: string
  finished_at?: string
  time?: string
  memory?: number
  stderr?: string
  compile_output?: string
  message?: string
  wall_time?: string
  exit_code?: number
  exit_signal?: number
  status?: Status
  language?: Language
}

export interface Status {
  id: number
  description: string
}

export interface ExecutionResult {
  success: boolean
  output?: string
  error?: string
  time?: string
  memory?: number
  status?: string
  compile_output?: string
}
