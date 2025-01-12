// This is 98 % AI generated code.
type ToastType = 'error' | 'success' | 'info';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
}

class Toast {
  readonly id: string;
  readonly message: string;
  readonly type: ToastType;
  readonly duration: number;

  constructor({ message, type = 'error', duration = 3000 }: ToastConfig) {
    this.id = crypto.randomUUID();
    this.message = message;
    this.type = type;
    this.duration = duration;
  }
}

class ToastStore {
  toasts = $state<Toast[]>([]);

  show({ message, type = 'error', duration = 3000 }: ToastConfig): void {
    const toast = new Toast({ message, type, duration });
    this.toasts = [...this.toasts, toast];

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== toast.id);
    }, duration);
  }
}

export const toaster = new ToastStore();
