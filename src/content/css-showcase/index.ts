import type { CssPattern } from './pattern';

/**
 * Every published pattern, in the order the listing shows them.
 *
 * Adding one means writing a module in this directory and listing it here.
 * Nothing under `src/app` changes, and an empty list is a valid state: the
 * listing renders its empty view and no detail routes are generated.
 */
export const patterns: readonly CssPattern[] = [];
