import { expect, userEvent, waitFor, within } from '@storybook/test';

/**
 * Convenience wrapper for querying within the rendered story canvas.
 */
export const canvasWithin = (canvasElement: HTMLElement) => within(canvasElement);

/**
 * Remove any localStorage keys prior to running an interaction test so that
 * components relying on persisted state behave deterministically.
 */
export const resetStorageKeys = (...keys: string[]): void => {
  if (typeof window === 'undefined') {
    return;
  }

  keys.forEach((key) => {
    window.localStorage.removeItem(key);
  });
};

/**
 * Small helper to ensure we wait for layout/animation frames between
 * state changes inside play functions.
 */
export const nextFrame = (): Promise<void> =>
  new Promise((resolve) => requestAnimationFrame(() => resolve()));

export { expect, userEvent, waitFor, within };
