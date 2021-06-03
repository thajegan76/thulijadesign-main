import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toTwentyFourHours, toTwelveHours } from '../../../shared/services/builtin/format-timepicker';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { SalaryRange } from '../../../shared/models/general/salary-range';
import { SalaryRangeService } from '../../../shared/services/general/salary-range.service';

@Component({
	selector: 'app-salary-range-modify',
	templateUrl: './salary-range-modify.component.html',
	styleUrls: ['./salary-range-modify.component.css']
})
export class SalaryRangeModifyComponent implements OnInit {

	public salaryRangeForm:FormGroup;
	public errorMessage:string;

	constructor(private salaryRangeService:SalaryRangeService,
		private dialogRef: MatDialogRef<SalaryRangeModifyComponent>,
		@Inject(MAT_DIALOG_DATA) public salaryRange:SalaryRange) {
	}

	ngOnInit() {
		if (this.salaryRange.id === 0) {
			this.salaryRangeForm = this.createSalaryRangeForm();
		} else {
			this.salaryRangeForm = this.editSalaryRangeForm();
		}
	}

	createSalaryRangeForm():FormGroup {
		let salaryRangeForm = new FormGroup({
			sequence: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.min(1),
					Validators.max(20),
					Validators.pattern("^[0-9]*$")
				]
			}),
			name: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.minLength(1),
					Validators.maxLength(60)
				]
			}),
			description: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.minLength(1),
					Validators.maxLength(150)
				]
			}),
			byDefault: new FormControl(0)
		})
		return salaryRangeForm;
	}

	editSalaryRangeForm():FormGroup {
		let salaryRangeForm = new FormGroup({
			sequence: new FormControl(this.salaryRange.sequence, [
				Validators.required, 
				Validators.pattern("^[0-9]*$"),
				Validators.min(1),
				Validators.max(20)
			]), 
			name: new FormControl(this.salaryRange.name, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(60)
			]), 
			description: new FormControl(this.salaryRange.description, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(150)
			]), 
			byDefault: new FormControl(
				Boolean(Number(this.salaryRange.byDefault)))
		})
		return salaryRangeForm;
	}

	public hasError = (controlName:string, errorName:string):boolean => {
		return this.salaryRangeForm.controls[controlName].hasError(errorName);
	}

	private validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	public save(salaryRange:SalaryRange) {
		if (this.salaryRangeForm.valid) {
			if (this.salaryRange.id === 0) {
				this.salaryRangeService.save(salaryRange).subscribe((salaryRanges) => {
					this.dialogRef.close(salaryRanges);
				}, (error) => {
					this.errorMessage = error.message;
				})
			} else {
				salaryRange.id = this.salaryRange.id;
				this.salaryRangeService.update(salaryRange.id, salaryRange).subscribe((salaryRanges) => {
					this.dialogRef.close(salaryRanges);
				}, (error) => {
					this.errorMessage = error.message;
				})
			}
		} else {
			this.validateAllFormFields(this.salaryRangeForm);
		}
	}

	public onCancel() {
		this.dialogRef.close();
	}

}
