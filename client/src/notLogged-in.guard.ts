import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class NotLoggedInGuard implements CanActivate {
  constructor() {}

  canActivate(): boolean {
    if (localStorage.getItem('currentUser')) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
