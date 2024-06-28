import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../service/admin.service';
import { AuthService } from 'src/app/auth/auth-services/auth-service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  products: any[] = [];
  searchProductForm!: FormGroup;
  isSpinning = false;
  user: any;
  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]],
    });
    this.getAllProducts();

    this.authService.getUserById().subscribe(user => {
      this.user = user;
    });
  }

  userJson = localStorage.getItem('currentUser');
    if (userJson) {
      this.user = JSON.parse(userJson);
    }

  submitForm(): void {
    this.isSpinning = true;
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.adminService.getProductsByTitle(title).subscribe((res) => {
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
        this.products.push(element);
      });
      this.isSpinning = false;
    });
  }

  getAllProducts(): void {
    this.isSpinning = true;
    this.products = [];
    this.adminService.getAllProducts().subscribe((res) => {
      console.log(res);
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
        this.products.push(element);
      });
      console.log(this.products);
      this.isSpinning = false;
    });
  }

  deleteProduct(productId: any): void {
    this.adminService.deleteProductById(productId).subscribe((res) => {
      if (res.body == null) {
        this.snackBar.open('Product Deleted Successfully!', 'Close', {
          duration: 5000
        });
        this.getAllProducts();
      } else {
        this.snackBar.open(res.message, 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }
}
