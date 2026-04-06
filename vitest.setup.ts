import "@testing-library/jest-dom/vitest";

// Mock IntersectionObserver for jsdom (not available in test environment)
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  value: MockIntersectionObserver,
});
