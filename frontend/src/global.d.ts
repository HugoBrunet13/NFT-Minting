interface Window {
    ethereum?: {
      request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (eventName: string, callback: () => void) => void;
    };
  }