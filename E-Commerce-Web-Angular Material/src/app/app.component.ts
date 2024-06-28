import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserStorageService } from './auth/auth-services/storage-service/user-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();
  showLandingPage = true;
  
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
        this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
        this.updateLandingPageVisibility();
      }
    });
  }

  logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }

  private updateLandingPageVisibility() {
    const currentUrl = this.router.url;
    const landingPageRoutes = ['/order', '/register', '/login'];
    this.showLandingPage = !landingPageRoutes.some(route => currentUrl.includes(route));
  }
}
