
export class ProgramCategory {

	public options:{} = {};

    constructor(public id?:number, 
		public sequence?:number,
		public name?:string,
		public description?:string,
		public byDefault?:boolean) {
	}

}