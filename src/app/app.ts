import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Employee } from './services/employee';
import { Subscription } from 'rxjs';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  employeeForm: FormGroup;
  employees: User[] = [];
  newEmployee: User = {
    id: 0,
    name: '',
    city: '',
    state: '',
    pin: '',
    emailId: '',
    contactNo: '',
    address: ''
  };
  isEdit = true;
  constructor(private fb: FormBuilder, private emp: Employee) {
    this.employeeForm = this.fb.group({
      id: [''], // <-- add this line for id
      name: ['', [Validators.required, Validators.minLength(3)]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      pin: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
      emailId: ['', [Validators.required, Validators.email]],
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
          this.employeeForm.reset();
        }
      });
    }
  }



  editEmployee(user: User) {
    console.log('Employee received for edit:', user);
    this.isEdit = false;

    this.employeeForm.patchValue({
      id: user.id || '',
      name: user.name || '',
      city: user.city || '',
      state: user.state || '',
      pin: user.pin || '000000', // placeholder to pass validation
      emailId: user.emailId || '',
      contactNo: user.contactNo || '',
      address: user.address || 'N/A' // placeholder
    });
  }


  editData(): Subscription | void {
    console.log('Form valid before update:', this.employeeForm.valid);
    console.log('Form errors before update:', this.employeeForm.errors);
    console.log('Form value before update:', this.employeeForm.value);

    if (this.employeeForm.valid) {
      this.newEmployee = this.employeeForm.value;
      return this.emp.updateData(this.newEmployee).subscribe({
        next: (data) => {
          if (data) {
            this.getEmployee();
            this.employeeForm.reset();
            this.isEdit = true;
          }
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    } else {
      console.log('Form invalid:', this.employeeForm.errors);
    }
  }

  deleteUser(id: number): Subscription | void {
    this.emp.removeData(id).subscribe({
      next: () => {
        console.log('Deleted successfully');
        this.getEmployee();
      },
      error: (err) => {
        console.error('Error deleting:', err);
      }
    });
  }
  // deleteEmployee(id: number) {
  //   this.emp.removeData(id).subscribe({
  //     next: () => {
  //       this.employees = this.employees.filter(emp => emp.id !== id);
  //       console.log('Deleted successfully');
  //     },
  //     error: (err) => {
  //       console.error('Error deleting:', err);
  //     }
  //   });
  // }


}
