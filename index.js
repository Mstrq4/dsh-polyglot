import { applyNativeBridge } from './src/native-bridge.js';

/** Public HTTP services own a guarded native-frame adapter; locale stays Client-owned. */
export const inject = ['webServer', 'clientModules'];
export function apply(ctx) { applyNativeBridge(ctx); }
