import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from './session.service';

export interface AuthResponse { token: string; email: string; fullName: string; }
export interface Business { id: string; name: string; businessType: string; state: string; registrationNumber?: string; }
export interface ComplianceRule { id: string; name: string; filingType: string; frequency: string; jurisdiction: string; nextDueDate: string; }
export interface Deadline { id: string; title: string; dueDate: string; status: string; businessId: string; }
export interface Dashboard { total: number; upcoming: number; dueSoon: number; overdue: number; completed: number; }

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:8080/api/v1';
  private readonly session = inject(SessionService);
  constructor(private http: HttpClient) {}
  register(fullName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, { fullName, email, password });
  }
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, { email, password });
  }
  private headers(): HttpHeaders {
    const token = this.session.token();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
  dashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.base}/dashboard`, { headers: this.headers() });
  }
  createBusiness(payload: { name: string; businessType: string; state: string; registrationNumber?: string }): Observable<Business> {
    return this.http.post<Business>(`${this.base}/businesses`, payload, { headers: this.headers() });
  }
  createRule(payload: { name: string; filingType: string; frequency: string; jurisdiction: string; dayOfMonth?: number; nextDueDate: string }): Observable<ComplianceRule> {
    return this.http.post<ComplianceRule>(`${this.base}/rules`, payload, { headers: this.headers() });
  }
  addSampleDeadlines(businessId: string): Observable<Deadline[]> {
    return this.http.post<Deadline[]>(`${this.base}/deadlines/samples?businessId=${encodeURIComponent(businessId)}`, {}, { headers: this.headers() });
  }
  generateDeadline(businessId: string, ruleId: string): Observable<Deadline> {
    return this.http.post<Deadline>(`${this.base}/deadlines/generate?businessId=${encodeURIComponent(businessId)}&ruleId=${encodeURIComponent(ruleId)}`, {}, { headers: this.headers() });
  }
  completeDeadline(id: string): Observable<Deadline> {
    return this.http.patch<Deadline>(`${this.base}/deadlines/${id}/complete`, {}, { headers: this.headers() });
  }
  businesses(): Observable<Business[]> {
    return this.http.get<Business[]>(`${this.base}/businesses`, { headers: this.headers() });
  }
  rules(): Observable<ComplianceRule[]> {
    return this.http.get<ComplianceRule[]>(`${this.base}/rules`, { headers: this.headers() });
  }
  deadlines(): Observable<Deadline[]> {
    return this.http.get<Deadline[]>(`${this.base}/deadlines`, { headers: this.headers() });
  }
}
