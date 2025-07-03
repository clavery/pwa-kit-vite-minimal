import { expect, test } from 'vitest'
import { isEven } from './utils'

test('is Even', () => {
  expect(isEven(1)).toBe(false)
})
