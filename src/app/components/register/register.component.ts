import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, SignInComponent, SignUpComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  activeTab: 'signIn' | 'signUp' = 'signIn';

  selectTab(tab: 'signIn' | 'signUp') {
    this.activeTab = tab;
  }
}
