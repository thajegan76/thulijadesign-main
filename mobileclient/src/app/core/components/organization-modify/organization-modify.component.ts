import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { toTwentyFourHours, toTwelveHours } from '../../../shared/services/builtin/format-timepicker';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ModalController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';

import { OrganizationType } from '../../../shared/models/core/organization-type';
import { OrganizationTypeService } from '../../../shared/services/core/organization-type.service';
import { Organization } from '../../../shared/models/core/organization';
import { OrganizationService } from '../../../shared/services/core/organization.service';

@Component({
	selector: 'app-organization-modify',
	templateUrl: './organization-modify.component.html',
	styleUrls: ['./organization-modify.component.scss']
})
export class OrganizationModifyComponent implements OnInit {

	public organizationForm:FormGroup;
	public organization:Organization;
	public organizationTypes:OrganizationType[];
	public currentOrganizationType:OrganizationType;
	public errorMessage:string;

	compareOrganizationType = (currentorganizationType: OrganizationType, organizationType: OrganizationType) => currentorganizationType.id == organizationType.id;

	constructor(private organizationService:OrganizationService,
			private organizationTypeService:OrganizationTypeService,
			private modalController: ModalController,
			private navParams: NavParams) {
		this.organization = this.navParams.get('organization');
		this.organizationTypeService.findAllByLookup().subscribe(organizationTypes => {
			this.organizationTypes = organizationTypes;
			if (this.organization.id === 0) {
				this.organizationTypes.forEach((organizationType) => {
					if (organizationType.byDefault == true) this.organizationForm.controls['organizationType'].setValue(organizationType);
				}, (error) => {
					this.errorMessage = error.message;
				})
			}
		})
	}

	ngOnInit() {
		if (this.organization.id === 0) {
			this.organizationForm = this.createOrganizationForm();
		} else {
			this.organizationForm = this.editOrganizationForm();
		}
	}

	createOrganizationForm():FormGroup {
		let organizationForm = new FormGroup({
			organizationType: new FormControl('', {
				validators: [
				]
			}),
			abbreviation: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.minLength(1),
					Validators.maxLength(50)
				]
			}),
			name: new FormControl('', {
				validators: [
					Validators.required, 
					Validators.minLength(1),
					Validators.maxLength(150)
				]
			}),
			domainUrl: new FormControl('', {
				validators: [
					Validators.minLength(1),
					Validators.maxLength(120)
				]
			}),
			googleAnalyticCode: new FormControl('', {
				validators: [
					Validators.minLength(1),
					Validators.maxLength(20)
				]
			}),
			organizationAdministrator: new FormControl(0), 
			organizationTypeAdministrator: new FormControl(0), 
			profile: new FormControl('', {
				validators: [
					Validators.minLength(1),
					Validators.maxLength(25)
				]
			})
		})
		return organizationForm;
	}

	editOrganizationForm():FormGroup {
		this.currentOrganizationType = this.organization.organizationType;
		let organizationForm = new FormGroup({
			organizationType: new FormControl(this.organization.organizationType, [
			]), 
			abbreviation: new FormControl(this.organization.abbreviation, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(50)
			]), 
			name: new FormControl(this.organization.name, [
				Validators.required, 
				Validators.minLength(1),
				Validators.maxLength(150)
			]), 
			domainUrl: new FormControl(this.organization.domainUrl, [
				Validators.minLength(1),
				Validators.maxLength(120)
			]), 
			googleAnalyticCode: new FormControl(this.organization.googleAnalyticCode, [
				Validators.minLength(1),
				Validators.maxLength(20)
			]), 
			organizationAdministrator: new FormControl(
				Boolean(Number(this.organization.organizationAdministrator))), 
			organizationTypeAdministrator: new FormControl(
				Boolean(Number(this.organization.organizationTypeAdministrator))), 
			profile: new FormControl(this.organization.profile, [
				Validators.minLength(1),
				Validators.maxLength(25)
			])
		})
		return organizationForm;
	}

	public hasError = (controlName:string, errorName:string):boolean => {
		return this.organizationForm.controls[controlName].hasError(errorName);
	}

	public save(organization:Organization) {
		if (this.organization.id === 0) {
			this.organizationService.save(organization).subscribe((organizations) => {
				this.modalController.dismiss({ 'dismissed': true, 'organizations':organizations });
			}, (error) => {
					this.errorMessage = error.message;
			})
		} else {
			organization.id = this.organization.id;
			this.organizationService.update(organization.id, organization).subscribe((organizations) => {
				this.modalController.dismiss({ 'dismissed': true, 'organizations':organizations });
			}, (error) => {
					this.errorMessage = error.message;
			})
		}
	}

	public onCancel() {
		this.modalController.dismiss({ 'dismissed': true });
	}

}
