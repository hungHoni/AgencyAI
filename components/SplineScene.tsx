"use client";

import React, { Suspense, useState, useCallback, Component, type ReactNode } from "react";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

class SplineErrorBoundary extends Component<
  { children: ReactNode; onError?: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function SplineScene({
  scene,
  className = "",
  onError,
}: {
  scene: string;
  className?: string;
  onError?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const onLoad = useCallback(() => setLoaded(true), []);

  return (
    <SplineErrorBoundary onError={onError}>
      <div
        className={`${className} transition-opacity duration-[1.5s] ease-smooth ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <Suspense fallback={null}>
          <Spline scene={scene} onLoad={onLoad} />
        </Suspense>
      </div>
    </SplineErrorBoundary>
  );
}
