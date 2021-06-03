import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { toTwentyFourHours, toTwelveHours } from '../../../shared/services/builtin/format-timepicker';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

import { AddressType } from '../../../shared/models/general/address-type';
import { AddressTypeService } from '../../../shared/services/general/address-type.service';

@Component({
	selector: 'app-address-type-modify',
	templateUrl: './address-type-modify.component.html',
	styleUrls: ['./address-type-modify.component.css']
})
export class AddressTypeModifyComponent implements OnInit {

	public addressTypeForm:FormGroup;
	public errorMessage:string;

	constructor(private addressTypeService:AddressTypeService,
		private dialogRef: MatDialogRef<AddressTypeModifyComponent>,
		@Inject(MAT_DIALOG_DATA) public addressType:AddressType) {
	}

	ngOnInit() {
		if (this.addressType.id === 0) {
			this.addressTypeForm = this.createAddressTypeForm();
		} else {
			this.addressTypeForm = this.editAddressTypeForm();
		}
	}

	createAddressTypeForm():FormGroup {
		let addressTypeForm = new FormGroup({
			sequence: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.min(1),
					Validators.max(25),
					Validators.pattern("^[0-9]*$")
				]
			}),
			code: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.minLength(1),
					Validators.maxLength(10)
				]
			}),
			name: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.minLength(1),
					Validators.maxLength(60)
				]
			}),
			byDefault: new FormControl(0)
		})
		return addressTypeForm;
	}

	editAddressTypeForm():FormGroup {
		let addressTypeForm = new FormGroup({
			sequence: new FormControl(this.addressType.sequence, [
				Validators.required, 
				Validators.pattern("^[0-9]*$"),
				Validators.min(1),
				Validators.max(25)
			]), 
			code: new FormControl(this.addressType.code, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(10)
			]), 
			name: new FormControl(this.addressType.name, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(60)
			]), 
			byDefault: new FormControl(
				Boolean(Number(this.addressType.byDefault)))
		})
		return addressTypeForm;
	}

	public hasError = (controlName:string, errorName:string):boolean => {
		return this.addressTypeForm.controls[controlName].hasError(errorName);
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

	public save(addressType:AddressType) {
		if (this.addressTypeForm.valid) {
			if (this.addressType.id === 0) {
				this.addressTypeService.save(addressType).subscribe((addressTypes) => {
					this.dialogRef.close(addressTypes);
				}, (error) => {
					this.errorMessage = error.message;
				})
			} else {
				addressType.id = this.addressType.id;
				this.addressTypeService.update(addressType.id, addressType).subscribe((addressTypes) => {
					this.dialogRef.close(addressTypes);
				}, (error) => {
					this.errorMessage = error.message;
				})
			}
		} else {
			this.validateAllFormFields(this.addressTypeForm);
		}
	}

	public onCancel() {
		this.dialogRef.close();
	}

}
