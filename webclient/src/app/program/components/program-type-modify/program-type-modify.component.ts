import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toTwentyFourHours, toTwelveHours } from '../../../shared/services/builtin/format-timepicker';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { ProgramType } from '../../../shared/models/program/program-type';
import { ProgramTypeService } from '../../../shared/services/program/program-type.service';

@Component({
	selector: 'app-program-type-modify',
	templateUrl: './program-type-modify.component.html',
	styleUrls: ['./program-type-modify.component.css']
})
export class ProgramTypeModifyComponent implements OnInit {

	public programTypeForm:FormGroup;
	public errorMessage:string;

	constructor(private programTypeService:ProgramTypeService,
		private dialogRef: MatDialogRef<ProgramTypeModifyComponent>,
		@Inject(MAT_DIALOG_DATA) public programType:ProgramType) {
	}

	ngOnInit() {
		if (this.programType.id === 0) {
			this.programTypeForm = this.createProgramTypeForm();
		} else {
			this.programTypeForm = this.editProgramTypeForm();
		}
	}

	createProgramTypeForm():FormGroup {
		let programTypeForm = new FormGroup({
			sequence: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.min(1),
					Validators.max(2000),
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
					Validators.maxLength(250)
				]
			}),
			byDefault: new FormControl(0)
		})
		return programTypeForm;
	}

	editProgramTypeForm():FormGroup {
		let programTypeForm = new FormGroup({
			sequence: new FormControl(this.programType.sequence, [
				Validators.required, 
				Validators.pattern("^[0-9]*$"),
				Validators.min(1),
				Validators.max(2000)
			]), 
			name: new FormControl(this.programType.name, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(60)
			]), 
			description: new FormControl(this.programType.description, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(250)
			]), 
			byDefault: new FormControl(
				Boolean(Number(this.programType.byDefault)))
		})
		return programTypeForm;
	}

	public hasError = (controlName:string, errorName:string):boolean => {
		return this.programTypeForm.controls[controlName].hasError(errorName);
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

	public save(programType:ProgramType) {
		if (this.programTypeForm.valid) {
			if (this.programType.id === 0) {
				this.programTypeService.save(programType).subscribe((programTypes) => {
					this.dialogRef.close(programTypes);
				}, (error) => {
					this.errorMessage = error.message;
				})
			} else {
				programType.id = this.programType.id;
				this.programTypeService.update(programType.id, programType).subscribe((programTypes) => {
					this.dialogRef.close(programTypes);
				}, (error) => {
					this.errorMessage = error.message;
				})
			}
		} else {
			this.validateAllFormFields(this.programTypeForm);
		}
	}

	public onCancel() {
		this.dialogRef.close();
	}

}
