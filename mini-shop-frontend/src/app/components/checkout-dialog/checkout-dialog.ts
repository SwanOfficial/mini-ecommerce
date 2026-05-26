import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service'; // Profile data ဆွဲထုတ်ဖို့

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule
  ],
  templateUrl: './checkout-dialog.html',
  styleUrl: './checkout-dialog.css'
})
export class CheckoutDialog implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<CheckoutDialog>);

  checkoutForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview = signal<string | null>(null);

  ngOnInit() {
    this.checkoutForm = this.fb.group({
      shippingAddress: ['', Validators.required],
      shippingPhone: ['', Validators.required],
      paymentMethod: ['KPAY', Validators.required]
    });

    this.loadUserDefaultInfo();
  }

  // User ရဲ့ မူရင်း Profile ထဲက ဖုန်းနဲ့ လိပ်စာကို အလိုအလျောက် Form ထဲ ဖြည့်
  loadUserDefaultInfo() {
    this.userService.getMyProfile().subscribe({
      next: (user) => {
        this.checkoutForm.patchValue({
          shippingAddress: user.address,
          shippingPhone: user.phoneNumber
        });
      }
    });
  }

  // User က Slip ပုံ ရွေးလိုက်တဲ့အချိန်မှာ ဖတ်ယူပြီး Preview ပြ
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.checkoutForm.valid && this.selectedFile) {
      
      this.dialogRef.close({
        formValue: this.checkoutForm.value,
        slipFile: this.selectedFile
      });
    }
  }
}