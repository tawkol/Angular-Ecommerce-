import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  template: `<div
    [class]="
      showMessage.toastVisible
        ? 'show toast align-items-center text-bg-primary border-0 position-fixed bottom-0 mb-3 p-1 start-50 translate-middle-x'
        : 'toast align-items-center text-bg-primary border-0'
    "
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
  >
    <div class="d-flex">
      <div class="toast-body">{{ showMessage.message }}</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto d"
        data-bs-dismiss="toast"
        aria-label="Close"
        (click)="closeToast()"
      ></button>
    </div>
  </div>`,
})
export class ToastComponent {
  @Input() showMessage: any = {
    message: 'Hello, world! This is a toast message.',
    toastVisible: false,
  };
  closeToast() {
    this.showMessage.toastVisible = false; // Method to close the toast
  }
}
