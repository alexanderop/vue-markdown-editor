export type Result<T> = readonly [Error, null] | readonly [null, T]

const toError = (value: unknown): Error =>
  value instanceof Error ? value : new Error(String(value))

export function tryCatch<T>(input: Promise<T>): Promise<Result<T>>
export function tryCatch<T>(input: () => T): Result<T>
export function tryCatch<T>(input: Promise<T> | (() => T)): Result<T> | Promise<Result<T>> {
  if (typeof input === 'function') {
    try {
      return [null, input()] as const
    } catch (error) {
      return [toError(error), null] as const
    }
  }
  return input.then(
    (value): Result<T> => [null, value] as const,
    (error): Result<T> => [toError(error), null] as const,
  )
}
