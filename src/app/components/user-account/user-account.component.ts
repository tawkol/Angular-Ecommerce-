import { Component } from '@angular/core';
import {
  faUser,
  faAddressBook,
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-account',
  standalone: true,
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css'],
  imports: [FontAwesomeModule, FormsModule, CommonModule],
})
export class UserAccountComponent {
  faUser = faUser;
  faAddressBook = faAddressBook;
  faPlus = faPlus;
  faEdit = faEdit;
  faTrash = faTrash;
  faSave = faSave;
  faTrashAlt = faTrashAlt;

  user: any; // Current user object
  showAddAddressForm = false; // Toggle for address form
  isUpdating = false; // Update mode
  currentAddress: any = {}; // Address being added or updated
  updatingIndex = -1; // Index of address being updated

  constructor(private userService: UserService) {
    this.loadUser();
  }

  loadUser(): void {
    this.user = this.userService.user;
    console.log(this.user());
  }

  addAddress(): void {
    console.log(this.currentAddress);

    this.userService.addAddress(this.currentAddress).subscribe(
      (res) => {
        console.log(res);
        this.userService.setCurrentUser(res);
        this.showAddAddressForm = false;
        this.currentAddress = {};
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editAddress(index: number): void {
    console.log(index);

    this.currentAddress = { ...this.user()?.user.address[index] };
    this.updatingIndex = index;
    this.isUpdating = true;
    this.showAddAddressForm = true;
  }

  updateAddress(): void {
    this.userService
      .updateAddress(this.currentAddress, this.updatingIndex)
      .subscribe(
        (res) => {
          console.log(res);
          this.userService.setCurrentUser(res);
          this.loadUser(); // Reload user data
          this.isUpdating = false;
          this.showAddAddressForm = false;
          this.currentAddress = {};
        },
        (error) => {
          console.error(error);
        }
      );
  }

  deleteAddress(index: number): void {
    this.userService.deleteAddress(index).subscribe(
      (res) => {
        console.log(res);
        this.userService.setCurrentUser(res);
        this.loadUser(); // Reload user data
      },
      (error) => {
        console.error(error);
      }
    );
  }

  deleteAccount(): void {
    this.userService.deleteUser().subscribe(
      () => {
        this.userService.logout(); // Log out the user
        window.location.reload(); // Reload user data
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
