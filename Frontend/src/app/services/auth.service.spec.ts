import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { PLATFORM_ID } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let mockAxios: MockAdapter;
  let platformId: Object;

  beforeEach(() => {
    platformId = 'browser';
    mockAxios = new MockAdapter(axios);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user and return userId', async () => {
    const mockResponse = { userId: 1 };
    mockAxios.onPost('http://localhost:8080/api/auth/login').reply(200, mockResponse);

    const result = await service.login('test@example.com', 'password');
    expect(result).toEqual(mockResponse);
  });

  it('should verify code and return token', async () => {
    const mockResponse = { token: 'dummy.token.value' };
    mockAxios.onPost('http://localhost:8080/api/auth/verify-code').reply(200, mockResponse);

    const result = await service.verifyCode(1, '123456');
    expect(result).toEqual(mockResponse);
  });

  it('should store token and update auth status', () => {
    spyOn(localStorage, 'setItem');
    spyOn(service['authStatusSource'], 'next');

    service.storeToken('dummy.token.value');
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'dummy.token.value');
    expect(service['authStatusSource'].next).toHaveBeenCalledWith(true);
  });

  it('should return token from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('dummy.token.value');
    const token = service.getToken();
    expect(token).toBe('dummy.token.value');
  });

  it('should logout user and clear localStorage', () => {
    spyOn(localStorage, 'removeItem');
    spyOn(service['authStatusSource'], 'next');

    service.logout();
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('user_id');
    expect(service['authStatusSource'].next).toHaveBeenCalledWith(false);
  });

  it('should check initial login state', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') return 'dummy.token.value';
      return null;
    });
    spyOn<any>(service, 'isTokenValid').and.returnValue(true);
    spyOn(service['authStatusSource'], 'next');

    service.checkInitialLoginState();
    expect(service['authStatusSource'].next).toHaveBeenCalledWith(true);
  });

  it('should handle invalid token in check initial login state', () => {
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'auth_token') return 'invalid.token.value';
      return null;
    });
    spyOn<any>(service, 'isTokenValid').and.returnValue(false);
    spyOn(service['authStatusSource'], 'next');

    service.checkInitialLoginState();
    expect(service['authStatusSource'].next).toHaveBeenCalledWith(false);
  });

  it('should correctly validate a token', () => {
    const token = 'valid.jwt.token';
    const decodedToken = { userId: 1, exp: Math.floor(Date.now() / 1000) + 60 };
    spyOn<any>(jwtDecode, 'default').and.returnValue(decodedToken);

    expect(service['isTokenValid'](token)).toBe(true);
  });

  it('should invalidate an expired token', () => {
    const token = 'expired.jwt.token';
    const decodedToken = { userId: 1, exp: Math.floor(Date.now() / 1000) - 60 };
    spyOn<any>(jwtDecode, 'default').and.returnValue(decodedToken);

    expect(service['isTokenValid'](token)).toBe(false);
  });
});
