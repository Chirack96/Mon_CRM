import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {ElementRef} from "@angular/core";

class MockAuthService {
  login(): Promise<{ userId: number } | null> {
    return Promise.resolve({ userId: 1 });
  }
  verifyCode(): Promise<{ token: string } | null> {
    return Promise.resolve({ token: 'dummy.token.value' });
  }
  storeToken() {}
  setAuthStatus() {}
}

class MockRouter {
  navigate(): Promise<boolean> {
    return Promise.resolve(true);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call login and navigate on successful login', fakeAsync(() => {
    spyOn(authService, 'login').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
    component.email = 'test@example.com';
    component.password = 'password';
    component.loginStage = 1;

    component.login();
    tick();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(component.userId).toBe(1);
    expect(component.loginStage).toBe(2);
    expect(component.successMessage).toBe('Please enter the verification code sent to your email.');
  }));

  it('should display error message on failed login', fakeAsync(() => {
    spyOn(authService, 'login').and.returnValue(Promise.reject('Login failed'));
    component.email = 'test@example.com';
    component.password = 'wrongpassword';
    component.loginStage = 1;

    component.login();
    tick();

    expect(component.errorMessage).toBe('Login failed. Please check your email or password and try again.');
  }));

  it('should call verifyCode and navigate on successful code verification', fakeAsync(() => {
    spyOn(authService, 'verifyCode').and.callThrough();
    spyOn(authService, 'storeToken').and.callThrough();
    spyOn(authService, 'setAuthStatus').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();
    component.userId = 1;
    component.verificationCode = '123456';

    component.verifyCode();
    tick();

    expect(authService.verifyCode).toHaveBeenCalledWith(1, '123456');
    expect(authService.storeToken).toHaveBeenCalledWith('dummy.token.value');
    expect(authService.setAuthStatus).toHaveBeenCalledWith(true);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.successMessage).toBe('You are successfully logged in. Redirecting to dashboard...');
  }));

  it('should display error message on failed code verification', fakeAsync(() => {
    spyOn(authService, 'verifyCode').and.returnValue(Promise.reject('Verification failed'));
    component.userId = 1;
    component.verificationCode = 'wrongcode';

    component.verifyCode();
    tick();

    expect(component.errorMessage).toBe('Verification failed. Please check the code and try again.');
  }));

  it('should toggle password visibility', () => {
    component.passwordField = { nativeElement: document.createElement('input') } as ElementRef;
    component.passwordField.nativeElement.type = 'password';

    component.togglePasswordVisibility();
    expect(component.passwordField.nativeElement.type).toBe('text');

    component.togglePasswordVisibility();
    expect(component.passwordField.nativeElement.type).toBe('password');
  });
});
