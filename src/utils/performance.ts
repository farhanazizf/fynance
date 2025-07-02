/**
 * Performance monitoring utilities for FYnance app
 */
import { useEffect } from "react";

// Type definitions for performance entries
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== "undefined" && "performance" in window) {
      this.initializePerformanceObservers();
    }
  }

  private initializePerformanceObservers(): void {
    // Navigation timing
    if (performance.navigation) {
      window.addEventListener("load", () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType(
            "navigation"
          )[0] as PerformanceNavigationTiming;
          this.metrics.pageLoadTime =
            navigation.loadEventEnd - navigation.loadEventStart;
          this.logMetrics();
        }, 0);
      });
    }

    // Paint timing
    if ("PerformanceObserver" in window) {
      try {
        const paintObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.name === "first-contentful-paint") {
              this.metrics.firstContentfulPaint = entry.startTime;
            }
          });
        });
        paintObserver.observe({ entryTypes: ["paint"] });

        // Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
        });
        lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            const fidEntry = entry as PerformanceEventTiming;
            this.metrics.firstInputDelay =
              fidEntry.processingStart - fidEntry.startTime;
          });
        });
        fidObserver.observe({ entryTypes: ["first-input"] });

        // Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          list.getEntries().forEach((entry) => {
            const clsEntry = entry as LayoutShiftEntry;
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
            }
          });
          this.metrics.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ["layout-shift"] });
      } catch (error) {
        console.warn("Performance Observer not fully supported:", error);
      }
    }
  }

  private logMetrics(): void {
    console.group("🚀 FYnance Performance Metrics");
    console.log("Page Load Time:", this.metrics.pageLoadTime?.toFixed(2), "ms");
    console.log(
      "First Contentful Paint:",
      this.metrics.firstContentfulPaint?.toFixed(2),
      "ms"
    );
    console.log(
      "Largest Contentful Paint:",
      this.metrics.largestContentfulPaint?.toFixed(2),
      "ms"
    );
    console.log(
      "First Input Delay:",
      this.metrics.firstInputDelay?.toFixed(2),
      "ms"
    );
    console.log(
      "Cumulative Layout Shift:",
      this.metrics.cumulativeLayoutShift?.toFixed(4)
    );
    console.groupEnd();

    // Performance recommendations
    this.provideRecommendations();
  }

  private provideRecommendations(): void {
    const recommendations: string[] = [];

    if (this.metrics.pageLoadTime && this.metrics.pageLoadTime > 3000) {
      recommendations.push(
        "⚡ Page load time is high. Consider optimizing bundle size."
      );
    }

    if (
      this.metrics.firstContentfulPaint &&
      this.metrics.firstContentfulPaint > 1800
    ) {
      recommendations.push(
        "🎨 First Contentful Paint is slow. Optimize critical rendering path."
      );
    }

    if (
      this.metrics.largestContentfulPaint &&
      this.metrics.largestContentfulPaint > 2500
    ) {
      recommendations.push(
        "🖼️ Largest Contentful Paint needs improvement. Optimize largest element loading."
      );
    }

    if (this.metrics.firstInputDelay && this.metrics.firstInputDelay > 100) {
      recommendations.push(
        "⌨️ First Input Delay is high. Reduce JavaScript execution time."
      );
    }

    if (
      this.metrics.cumulativeLayoutShift &&
      this.metrics.cumulativeLayoutShift > 0.1
    ) {
      recommendations.push(
        "📏 Cumulative Layout Shift is high. Ensure proper element sizing."
      );
    }

    if (recommendations.length > 0) {
      console.group("💡 Performance Recommendations");
      recommendations.forEach((rec) => console.log(rec));
      console.groupEnd();
    } else {
      console.log("✅ All performance metrics are within acceptable ranges!");
    }
  }

  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  public markFeatureUsage(feature: string): void {
    if ("performance" in window && performance.mark) {
      performance.mark(`feature-${feature}-used`);
    }
  }

  public measureFeatureTime(feature: string, startMark: string): void {
    if ("performance" in window && performance.measure) {
      try {
        performance.measure(`${feature}-duration`, startMark);
        const measure = performance.getEntriesByName(`${feature}-duration`)[0];
        console.log(`⏱️ ${feature} took ${measure.duration.toFixed(2)}ms`);
      } catch (error) {
        console.warn("Could not measure feature time:", error);
      }
    }
  }
}

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();

    // Mark app initialization
    monitor.markFeatureUsage("app-init");

    return () => {
      // Cleanup if needed
    };
  }, []);

  const markFeature = (feature: string) => {
    const monitor = PerformanceMonitor.getInstance();
    monitor.markFeatureUsage(feature);
  };

  return { markFeature };
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (process.env.NODE_ENV === "development") {
    PerformanceMonitor.getInstance();
  }
};
