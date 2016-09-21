import React, {Component} from 'react'
import {getInvoices, getCustomers, getProducts, getInvoiceItems} from "../api/api";

const requests = {
	getInvoices: "getInvoices",
	getCustomers: "getCustomers",
	getProducts: "getProducts",
};

export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			invoices: {},
			customers: {},
			customersById: {},
			products: {},
			invoiceItemsById: {},
			activeRequest: [requests.getInvoices, requests.getCustomers, requests.getProducts]
		};

		this.onChangeEntriesState = this.onChangeEntriesState.bind(this);
	}

	componentDidMount() {
		this.loadData();
	}

	loadData() {

		this.setState({
			activeRequest: [requests.getInvoices, requests.getCustomers, requests.getProducts]
		});

		getInvoices((invoicesJson) => {

			let invoicesById = invoicesJson.reduce((previousVal, currentVal) => {
				let invoiceId = currentVal.id;
				let obj = previousVal;
				obj[invoiceId] = currentVal;
				return obj;
			}, {});

			this.loadInvoiceItems(invoicesJson, (invoiceItemsObj) => {
				this.setState({
					invoices: invoicesJson,
					invoicesById: invoicesById,
					invoiceItemsById: invoiceItemsObj,
					activeRequest: this.deleteLoadedRequest(requests.getInvoices)
				});
			});

		});

		getCustomers((customersJson) => {
			let customersById = customersJson.reduce((previousVal, currentVal) => {
				let customerId = currentVal.id;
				let obj = previousVal;
				obj[customerId] = currentVal;
				return obj;
			}, {});

			this.setState({
				activeRequest: this.deleteLoadedRequest(requests.getCustomers),
				customers: customersJson,
				customersById: customersById
			});
		});


		getProducts((productsJson) => {
			let productsById = productsJson.reduce((previousVal, currentVal) => {
				let productId = currentVal.id;
				let obj = previousVal;
				obj[productId] = currentVal;
				return obj;
			}, {});

			this.setState({
				activeRequest: this.deleteLoadedRequest(requests.getProducts),
				products: productsJson,
				productsById: productsById
			});
		});
	}

	loadInvoiceItems(invoices, callback) {
		let invoiceItemsObj = {};
		if (invoices.length == 0) {
			callback(invoiceItemsObj);
		} else {
			invoices.forEach((invoice, idx) => {
				getInvoiceItems(invoice.id, (invoiceItems) => {
					invoiceItemsObj[invoice.id] = invoiceItems;
					if (invoices.length == (idx + 1)) {
						callback(invoiceItemsObj);
					}
				});
			});
		}
	}

	deleteLoadedRequest(loadedRequest) {
		return this.state.activeRequest.filter(e => e !== loadedRequest);
	}

	onChangeEntriesState() {
		this.loadData(); //todo fix this hack
	}

	render() {

		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
				invoices: this.state.invoices,
				invoicesById: this.state.invoicesById,
				customers: this.state.customers,
				customersById: this.state.customersById,
				products: this.state.products,
				productsById: this.state.productsById,
				invoiceItemsById: this.state.invoiceItemsById,
				onChangeEntriesState: this.onChangeEntriesState
			})
		);

		return (
			<div className='container'>
				{(this.state.activeRequest.length == 0) ? childrenWithProps : <div>Loading ... </div>}
			</div>
		)
	}
}