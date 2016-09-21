import React, {Component} from 'react'
import 'react-select2-wrapper/css/select2.css';

import InvoiceForm from './InvoiceForm';
import InvoicesTable from './InvoicesTable';


export default class Invoices extends Component {

	constructor(props) {
		super(props);

		this.state = {
			createInvoiceFormActive: false,
			editableInvoice: {
				isNewInvoice: true,
				editableInvoiceId: -1,
				editableInvoiceCustomerId: -1
			}
		};

		this.afterInvoiceModification = this.afterInvoiceModification.bind(this);
		this.onEditInvoice = this.onEditInvoice.bind(this);
	}

	changeInvoiceFormState() {
		let editableInvoice = this.state.editableInvoice;
		editableInvoice.isNewInvoice = true;
		this.setState({
			createInvoiceFormActive : !this.state.createInvoiceFormActive,
			editableInvoice: editableInvoice
		});
	}

	afterInvoiceModification() {
		this.setState({
			createInvoiceFormActive: false
		});
	}

	onEditInvoice(invoiceId, customerId) {
		this.setState({
			createInvoiceFormActive: true,
			editableInvoice: {
				isNewInvoice: false,
				editableInvoiceId: invoiceId,
				editableInvoiceCustomerId: customerId,
			}
		});

	}

	render() {
		return (
			<div className="Invoices">

				<div>
					<button className="Invoices__newInvoiceBtn btn btn-default"
									onClick={() => this.changeInvoiceFormState()}>
						{this.state.createInvoiceFormActive? "Cancel" : "Create new invoice"}
					</button>


					{this.state.createInvoiceFormActive?

						<InvoiceForm 	customers={this.props.customers}
													products={this.props.products}
													onChangeEntriesState={this.props.onChangeEntriesState}
													afterInvoiceModification={this.afterInvoiceModification}
													productsById={this.props.productsById}
													invoicesById={this.props.invoicesById}
													editableInvoice={this.state.editableInvoice}
													invoices={this.props.invoices}
													invoiceItemsById={this.props.invoiceItemsById}
													createInvoiceFormActive={this.state.createInvoiceFormActive}/>
						: null}


				</div>

				{this.props.invoices.length > 0?
					<InvoicesTable 	invoices={this.props.invoices}
													invoiceItemsById={this.props.invoiceItemsById}
													customersById={this.props.customersById}
													productsById={this.props.productsById}
													onEditInvoice={this.onEditInvoice} />
				 : null}
			</div>
		)
	}
}