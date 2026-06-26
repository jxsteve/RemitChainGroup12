/**
 * Tiny class-name joiner — filters out falsey values.
 * Replaces clsx/tailwind-merge now that the project uses plain CSS modules.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ')
}
