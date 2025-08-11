import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Employee } from './services/employee';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  employeeForm: FormGroup;
  employees: any[] = [];
  newEmployee = {
    name: '',
    city: '',
    state: '',
    emailId: '',
    contactNo: '',
    address: ''
  };
  constructor(private fb: FormBuilder, private emp: Employee) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pin: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      emailId: ['', [Validators.required,]],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required]]
    });
  }

  get name() {
    return this.employeeForm.get('name');
  }
  get emailId() {
    return this.employeeForm.get('emailId');
  }
  get contactNo() {
    return this.employeeForm.get('contactNo')
  }

  onSave() {
    if (this.employeeForm.valid) {
      this.employees.push(this.employeeForm.value);
      this.employeeForm.reset();
    }
  }
  ngOnInit() {
    this.getEmployee();
  }
  getEmployee(): Subscription | void {
    return this.emp.getEmployee().subscribe((data) => {
      this.employees = data
    })
  }

  addData(): Subscription | void {
    if (this.employeeForm.valid) {
      this.newEmployee = this.employeeForm.value;

      return this.emp.addData(this.newEmployee).subscribe((data) => {
        if (data) {
          this.getEmployee()
        }
      });
    }
  }
}
