export async function register() {
  // Node.js v22+ exposes an experimental localStorage that may be broken
  // when --localstorage-file is not set. We override it with a safe in-memory impl.
  try {
    const store = new Map();
    const safeStorage = {
      getItem(key) { return store.has(key) ? store.get(key) : null; },
      setItem(key, value) { store.set(key, String(value)); },
      removeItem(key) { store.delete(key); },
      clear() { store.clear(); },
      get length() { return store.size; },
      key(index) { return [...store.keys()][index] ?? null; },
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: safeStorage,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: safeStorage,
      writable: true,
      configurable: true,
    });
  } catch (_) {
    // ignore
  }
}
