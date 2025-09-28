import SumOfTwoIntegerSource from '../../questions/SumOfTwoInteger.java?raw'
import CountingBitsSource from '../../questions/CountingBits.java?raw'
import HammingDistanceSource from '../../questions/HammingDistance.java?raw'
import NumberOfOneBitsSource from '../../questions/NumberOfOneBits.java?raw'
import BinaryWatchSource from '../../questions/BinaryWatch.java?raw'
import MaximumProductOfWordLengthsSource from '../../questions/MaximumProductOfWordLengths.java?raw'

export interface Question {
  id: string
  title: string
  prompt: string
  language: string
}

interface QuestionSourceMeta {
  id: string
  title: string
  language: string
  raw: string
}

const QUESTION_SOURCES: QuestionSourceMeta[] = [
  {
    id: 'sum-of-two-integers',
    title: 'Sum of Two Integers',
    language: 'Java',
    raw: SumOfTwoIntegerSource,
  },
  {
    id: 'counting-bits',
    title: 'Counting Bits',
    language: 'Java',
    raw: CountingBitsSource,
  },
  {
    id: 'hamming-distance',
    title: 'Hamming Distance',
    language: 'Java',
    raw: HammingDistanceSource,
  },
  {
    id: 'number-of-one-bits',
    title: 'Number of One Bits',
    language: 'Java',
    raw: NumberOfOneBitsSource,
  },
  {
    id: 'binary-watch',
    title: 'Binary Watch',
    language: 'Java',
    raw: BinaryWatchSource,
  },
  {
    id: 'maximum-product-of-word-lengths',
    title: 'Maximum Product of Word Lengths',
    language: 'Java',
    raw: MaximumProductOfWordLengthsSource,
  },
]

function extractPrompt(raw: string): string {
  const lines = raw.split(/\r?\n/)
  const promptLines: string[] = []

  for (const line of lines) {
    if (line.trim().startsWith('//')) {
      promptLines.push(line.replace(/^\/\/\s?/, ''))
    } else if (line.trim() === '') {
      promptLines.push('')
    } else {
      break
    }
  }

  return promptLines.join('\n').trim()
}

export async function loadQuestions(): Promise<Question[]> {
  return QUESTION_SOURCES.filter(source => source.raw && source.raw.trim().length > 0).map(source => ({
    id: source.id,
    title: source.title,
    language: source.language,
    prompt: extractPrompt(source.raw),
  }))
}
