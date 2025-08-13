import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class Employee {
  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:3000/employees';

  getEmployee(){
    return this.http.get<User[]>(this.apiUrl)
  }

  addData(user: User): Observable<any> {
    return this.http.post<User[]>(this.apiUrl, user)
  }

  updateData(user: User): Observable<any> {
  return this.http.put<User[]>(`${this.apiUrl}/${user.id}`, user);
  }
  
  removeData(id: number):Observable<any>{
return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }

}
