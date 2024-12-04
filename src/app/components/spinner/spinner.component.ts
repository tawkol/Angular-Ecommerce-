import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  template: `<div class="spinner-border  spinner-border-sm" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`,
})
export class SpinnerComponent {}
