import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

import { BatchModule } from '../../../shared/models/program/batch-module';
import { BatchModuleService } from '../../../shared/services/program/batch-module.service';
import { Batch } from '../../../shared/models/program/batch';
import { BatchService } from '../../../shared/services/program/batch.service';
import { Program } from '../../../shared/models/program/program';
import { ProgramService } from '../../../shared/services/program/program.service';

import { BatchModuleManagerModifyComponent } from '../batch-module-manager-modify/batch-module-manager-modify.component';

@Component({
	selector: 'app-batch-module-manager',
	templateUrl: './batch-module-manager.component.html',
	styleUrls: ['./batch-module-manager.component.css']
})
export class BatchModuleManagerComponent implements OnInit, OnDestroy {

	public program:Program;
	public programId:number;
	public batch:Batch;
	public batchId:number;
	public batchModule:BatchModule;
	public batchModuleId:number;

	public batchModules:BatchModule[];
	private masterSub:Subscription;
	private detailSub:Subscription;
	private listSub:Subscription;

	constructor(private programService:ProgramService,
		private batchService:BatchService,
		private batchModuleService:BatchModuleService,
		private router:Router, private route: ActivatedRoute,
		private translatePipe: TranslatePipe,
		private modalController: ModalController,
		private alertController: AlertController) {
	}
	
	ngOnInit() {
		this.route.parent.paramMap.subscribe((params:ParamMap) => {
			this.programId = +params.get('id');
			this.masterSub = this.programService.findById(this.programId).subscribe((program) => {
				this.program = program;
			});
		});
		this.route.parent.paramMap.subscribe((params:ParamMap) => {
			this.batchId = +params.get('batchid');
			this.detailSub = this.batchService.findById(this.batchId).subscribe((batch) => {
				this.batch = batch;
				this.list();
			});
		});
	}
	
	ngOnDestroy() {
		if (this.listSub) {
			this.listSub.unsubscribe();
		}
		if (this.masterSub) {
			this.masterSub.unsubscribe();
		}
		if (this.detailSub) {
			this.detailSub.unsubscribe();
		}
	}
	
	list() {
		this.listSub = this.batchModuleService.findByBatchId(this.batch.id).subscribe((batchModules) => {
			this.batchModules = batchModules;
		})
	}

	async add() {
		let sequence:number = 1;
		if (this.batchModules !== undefined && this.batchModules.length > 0) {
			sequence = +this.batchModules[this.batchModules.length - 1].sequence;
		}
		let element = new BatchModule(0, undefined, this.batch, undefined, undefined );
		element.options = { masterDetail: "Batch" };
		const modal = await this.modalController.create({
			component: BatchModuleManagerModifyComponent,
			componentProps: { batchModule: element }
		});
		return await modal.present();

		/*
		if (batchModules !== undefined) this.batchModules = batchModules;
		*/
	}
	
	async edit(element:BatchModule) {
		element.options = { masterDetail: "Batch" };
		const modal = await this.modalController.create({
			component: BatchModuleManagerModifyComponent,
			componentProps: { batchModule: element }
		});
		return await modal.present();

		/*
		if (batchModules !== undefined) this.batchModules = batchModules;
		*/
	}
	
	async delete(element:BatchModule) {
		element.options = { masterDetail: "Program" };
		let alertConfirm = await this.alertController.create({
			header: this.translatePipe.transform("DELETE-CONFIRMATION-TITLE"),
			message: this.translatePipe.transform("DELETE-CONFIRMATION-MESSAGE"),
			buttons: [{
				text: "Ok",
				handler: () => {
					this.batchModuleService.delete(element).subscribe((batchModules) => {
						if (batchModules !== undefined) this.batchModules = batchModules;
					});
				}
			}, {
				text: "Cancel",
				role: "cancel"
			}]
		});
		await alertConfirm.present();
	}
	
	showDetail(element:BatchModule) {
	}
	
	print(element:BatchModule) {
	}

}
