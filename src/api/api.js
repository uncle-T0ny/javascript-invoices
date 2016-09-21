
const INVOICES_URL = 'http://localhost:8000/api/invoices/';
const INVOICE_URL = 'http://localhost:8000/api/invoices/:invoiceId/';
const INVOICE_ITEMS_URL = 'http://localhost:8000/api/invoices/:invoiceId/items/';
const INVOICE_ITEM_URL = 'http://localhost:8000/api/invoices/:invoiceId/items/:itemId/';
const CUSTOMERS_URL = 'http://localhost:8000/api/customers/';
const PRODUCTS_URL = 'http://localhost:8000/api/products/';


export function getInvoices(callback) {
	getEntriesByURL(INVOICES_URL, callback);
};

export function getInvoiceItems(invoiceId, callback) {
	getEntriesByURL(INVOICE_ITEMS_URL.replace(':invoiceId', invoiceId), callback);
};

export function getCustomers(callback) {
	getEntriesByURL(CUSTOMERS_URL, callback);
};

export function getProducts(callback) {
	getEntriesByURL(PRODUCTS_URL, callback);
};

function getEntriesByURL(URL, callback, entryId) {
	if (entryId) {
		URL = URL + entryId;
	}
	fetch(URL, {method: "GET"})
		.then(response => response.json())
		.then((json) => {
			return callback(json);
		})
		.catch((error) => {
			console.log(error);
		});
}

export function createInvoice(body, callback) {
	postEntry(INVOICES_URL, body, callback)
}

export function updateInvoice(invoiceId, body, callback) {
	putEntry(INVOICE_URL.replace(":invoiceId", invoiceId), body, callback)
}

export function createInvoiceItem(invoiceId, body, callback) {
	postEntry(INVOICE_ITEMS_URL.replace(":invoiceId", invoiceId), body, callback)
}

export function updateInvoiceItem(invoiceId, itemId, body, callback) {
	putEntry(INVOICE_ITEM_URL.replace(":invoiceId", invoiceId).replace(":itemId", itemId), body, callback)
}


function postEntry(URL, body, callback) {
	performRequest("POST", URL, body, callback)
}

function putEntry(URL, body, callback) {
	performRequest("PUT", URL, body, callback)
}

function performRequest(method, URL, body, callback) {
	var request = new Request(URL, {
		method: method,
		body: JSON.stringify(body),
		mode: 'cors',
		redirect: 'follow',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	});

	fetch(request)
		.then(response => response.json())
		.then((json) => {
			callback(json);
		})
		.catch((error) => {
			console.log(error);
		});
}