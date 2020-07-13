import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginData = [];

  constructor(private http: HttpClient) { }
  sendOTP(data){
    return this.http.post<any>('http://localhost:8000/sendOTP', data);
  }
  updateLoginData(res){
    this.loginData = [];
    this.loginData.push({otp: res.otp, phone: res.phone});
    localStorage.setItem('loginData', JSON.stringify(this.loginData) );
  }
}
