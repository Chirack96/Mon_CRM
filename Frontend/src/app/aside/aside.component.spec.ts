import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsideComponent } from './aside.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

class MockAuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(true);
  public authStatus = this.authStatusSubject.asObservable();

  setAuthStatus(status: boolean) {
    this.authStatusSubject.next(status);
  }
}

class MockUserService {
  getUserProfile(): Promise<User> {
    return Promise.resolve({ id: 1, firstname: 'Test', lastname: 'User', email: 'test@example.com', password: '', groupe: '' });
  }
}

describe('AsideComponent', () => {
  let component: AsideComponent;
  let fixture: ComponentFixture<AsideComponent>;
  let userService: UserService;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AsideComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UserService, useClass: MockUserService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user profile on login', async () => {
    spyOn(userService, 'getUserProfile').and.callThrough();

    component.ngOnInit();
    await fixture.whenStable();  // Attend que les promesses soient résolues
    fixture.detectChanges();

    expect(userService.getUserProfile).toHaveBeenCalled();
    expect(component.user).toEqual({ id: 1, firstname: 'Test', lastname: 'User', email: 'test@example.com', password: '', groupe: '' });
  });

  it('should set isLoggedIn based on authStatus', () => {
    authService.setAuthStatus(true); // Simule le changement de statut d'authentification
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(true);

    authService.setAuthStatus(false); // Simule le changement de statut d'authentification
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.isLoggedIn).toBe(false);
  });
});
