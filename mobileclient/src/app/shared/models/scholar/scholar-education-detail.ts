import { Scholar } from '../../../shared/models/scholar/scholar';
import { Qualification } from '../../../shared/models/general/qualification';
import { State } from '../../../shared/models/general/state';
import { Country } from '../../../shared/models/general/country';
import { FieldStudy } from '../../../shared/models/general/field-study';

export class ScholarEducationDetail {

	public options:{} = {};

    constructor(public id?:number, 
		public scholar?:Scholar,
		public instituteName?:string,
		public graduationDate?:Date,
		public qualification?:Qualification,
		public instituteLocation?:string,
		public fieldStudy?:FieldStudy,
		public major?:string,
		public grade?:string,
		public description?:string) {
	}

}