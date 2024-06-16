import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AsideComponent } from './aside/aside.component';
import { HomeComponent } from './home/home.component';
import { AuthService } from './services/auth.service';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { routes } from './app.routes' // Assurez-vous que vos routes sont définies ici

class MockAuthService {
  private authStatusSubject = new BehaviorSubject<boolean>(true);
  public authStatus = this.authStatusSubject.asObservable();

  checkInitialLoginState() {
    this.authStatusSubject.next(true);
  }

  setAuthStatus(status: boolean) {
    this.authStatusSubject.next(status);
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: MockAuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
      declarations: [AppComponent, HeaderComponent, FooterComponent, AsideComponent, HomeComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        provideRouter(routes) // Utilisation de provideRouter pour configurer le module de routage
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignorez les erreurs de modèles liés aux composants enfants
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize auth state on init', () => {
    spyOn(authService, 'checkInitialLoginState').and.callThrough();

    component.ngOnInit();

    expect(authService.checkInitialLoginState).toHaveBeenCalled();
  });

  it('should show aside component when user is logged in', () => {
    authService.setAuthStatus(true);
    fixture.detectChanges();

    const asideElement = fixture.debugElement.query(By.css('app-aside'));
    expect(asideElement).toBeTruthy();
  });

  it('should not show aside component when user is not logged in', () => {
    authService.setAuthStatus(false);
    fixture.detectChanges();

    const asideElement = fixture.debugElement.query(By.css('app-aside'));
    expect(asideElement).toBeNull();
  });
});
