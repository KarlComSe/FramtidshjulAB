// AI generated code. 
import { toaster } from '$lib/stores/toastSTore.svelte'

export function setupGlobalErrorHandler(): void {
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    toaster.show({ message: event.reason?.message || 'An unexpected error occurred' });
    event.preventDefault();
  });

  window.addEventListener('error', (event: ErrorEvent) => {
    toaster.show({ message: event.error?.message || 'An unexpected error occurred' });
    event.preventDefault();
  });
}

export function handleError(error: Error): null {
  toaster.show({ message: error.message });
  return null;
}