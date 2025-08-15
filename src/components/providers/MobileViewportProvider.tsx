'use client';

import { useMobileViewport } from '@/hooks/useMobileViewport';

export default function MobileViewportProvider() {
  useMobileViewport();
  return null;
}