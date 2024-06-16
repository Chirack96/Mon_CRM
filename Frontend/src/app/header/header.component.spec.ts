import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockAuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(true);
  public authStatus = this.authStatusSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading = this.isLoadingSubject.asObservable();

  logout() {
    this.authStatusSubject.next(false);
  }

  setAuthStatus(status: boolean) {
    this.authStatusSubject.next(status);
  }

  setLoadingStatus(loading: boolean) {
    this.isLoadingSubject.next(loading);
  }
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: MockAuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideRouter([])
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore errors for child components
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize auth status and loading status on init', () => {
    component.ngOnInit();
    fixture.detectChanges();
    authService.setAuthStatus(true);
    authService.setLoadingStatus(false);
    expect(component.isLogged).toBe(true);
    expect(component.isLoading).toBe(false);
  });

  it('logout () should logout and navigate to login', () => {
    spyOn(router, 'navigate').and.callThrough();
    component.logout();
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show navigation links when user is logged in', () => {
    authService.setAuthStatus(true);
    fixture.detectChanges();
    const navLinks = fixture.debugElement.queryAll(By.css('nav button a'));
    expect(navLinks.length).toBeGreaterThan(0);
  });

  it('should not show navigation links when user is not logged in', () => {
    authService.setAuthStatus(false);
    fixture.detectChanges();
    const navLinks = fixture.debugElement.queryAll(By.css('nav button a'));
    expect(navLinks.length).toBe(0);
  });

  it('should show login and register buttons when user is not logged in', () => {
    authService.setAuthStatus(false);
    fixture.detectChanges();
    const loginButton = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    const registerButton = fixture.debugElement.query(By.css('a[routerLink="/register"]'));
    expect(loginButton).toBeTruthy();
    expect(registerButton).toBeTruthy();
  });

  it('should not show login and register buttons when user is logged in', () => {
    authService.setAuthStatus(true);
    fixture.detectChanges();
    const loginButton = fixture.debugElement.query(By.css('a[routerLink="/login"]'));
    const registerButton = fixture.debugElement.query(By.css('a[routerLink="/register"]'));
    expect(loginButton).toBeFalsy();
    expect(registerButton).toBeFalsy();
  });

  it('should show logout button when user is logged in', () => {
    authService.setAuthStatus(true);
    fixture.detectChanges();
    const logoutButton = fixture.debugElement.query(By.css('button'));
    expect(logoutButton.nativeElement.textContent).toContain('Logout');
  });

  it('should not show logout button when user is not logged in', () => {
    authService.setAuthStatus(false);
    fixture.detectChanges();
    const logoutButton = fixture.debugElement.query(By.css('button'));
    expect(logoutButton).toBeFalsy();
  });

  it('should handle loading status', () => {
    authService.setLoadingStatus(true);
    fixture.detectChanges();
    const loadingElement = fixture.debugElement.query(By.css('.loading-indicator'));
    expect(loadingElement).toBeTruthy();
    authService.setLoadingStatus(false);
    fixture.detectChanges();
    expect(loadingElement).toBeFalsy();
  });
});
