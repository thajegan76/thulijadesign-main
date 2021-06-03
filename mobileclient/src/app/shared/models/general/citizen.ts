import { Country } from '../../../shared/models/general/country';

export class Citizen {

	public options:{} = {};

    constructor(public id?:number, 
		public sequence?:number,
		public country?:Country,
		public code?:string,
		public name?:string,
		public byDefault?:boolean) {
	}

}