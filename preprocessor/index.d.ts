export type Preprocessor = (options: {
  content: string
  attributes: Record<string, string | boolean>
  markup: string
  filename?: string
}) => Processed | void | Promise<Processed | undefined>

export interface Processed {
  code: string
  map?: string | object
}

export interface PreprocessorGroup {
  name: string
  script?: Preprocessor
}

export function phosphorSvelteOptimize(): PreprocessorGroup
