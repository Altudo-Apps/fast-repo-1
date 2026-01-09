import { vi } from 'vitest';
import clsx from 'clsx';

// Common mocks that can be reused across tests
export const mockCn = () => {
  vi.mock('src/core/lib/utils', () => ({
    cn: vi.fn((...args: unknown[]) => clsx(args)),
  }));
};
