import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface OrdersTableItem {
	name: string;
	id: number;
}

// TODO: replace this with real data from your application
const EXAMPLE_DATA: OrdersTableItem[] = [
	{ id: 1, name: 'Hydrogen' },
	{ id: 2, name: 'Helium' },
	{ id: 3, name: 'Lithium' },
	{ id: 4, name: 'Beryllium' },
	{ id: 5, name: 'Boron' },
	{ id: 6, name: 'Carbon' },
	{ id: 7, name: 'Nitrogen' },
	{ id: 8, name: 'Oxygen' },
	{ id: 9, name: 'Fluorine' },
	{ id: 10, name: 'Neon' },
	{ id: 11, name: 'Sodium' },
	{ id: 12, name: 'Magnesium' },
	{ id: 13, name: 'Aluminum' },
	{ id: 14, name: 'Silicon' },
	{ id: 15, name: 'Phosphorus' },
	{ id: 16, name: 'Sulfur' },
	{ id: 17, name: 'Chlorine' },
	{ id: 18, name: 'Argon' },
	{ id: 19, name: 'Potassium' },
	{ id: 20, name: 'Calcium' },
];

/**
 * Data source for the OrdersTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class OrdersTableDataSource {

	data: OrdersTableItem[] = EXAMPLE_DATA;

	constructor() {
	}

	/**
	 *  Called when the table is being destroyed. Use this function, to clean up
	 * any open connections or free any held resources that were set up during connect.
	 */
	disconnect() {}

	/**
	 * Paginate the data (client-side). If you're using server-side pagination,
	 * this would be replaced by requesting the appropriate data from the server.
	 */
	private getPagedData(data: OrdersTableItem[]) {
	}

}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
	return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}