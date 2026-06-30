import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

export type WebVitalsMetric = {
  id: string;
  name: string;
  value: number;
  rating?: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
};

export type WebVitalsReporter = (metric: WebVitalsMetric) => void;

export function reportWebVitals(onReport: WebVitalsReporter) {
  onCLS(onReport);
  onFCP(onReport);
  onINP(onReport);
  onLCP(onReport);
  onTTFB(onReport);
}