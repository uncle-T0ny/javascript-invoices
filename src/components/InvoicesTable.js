import React, {Component} from 'react';
import {roundNumber, getPercentsMultiplier} from '../util/util';

export default class InvoicesTable extends Component {

	constructor(props) {
		super(props);
	}

	renderInvoiceItems(invoice) {
		if (this.props.invoiceItemsById[invoice.id]) {
			return this.props.invoiceItemsById[invoice.id].map((invoiceItem) => {
				return <li key={"invoice_item_" + invoiceItem.id}>{this.props.productsById[invoiceItem.product_id].name}, {invoiceItem.quantity} items</li>;
			})
		} else {
			return null;
		}
	}

	render() {

		let invoices = this.props.invoices.map((invoice) => {
			return 	<tr key={"invoice_" + invoice.id}>
								<td>
									{this.props.customersById[invoice.customer_id]? this.props.customersById[invoice.customer_id].name : ""}
								</td>
								<td>
									<ul>
										{ this.renderInvoiceItems(invoice) }
									</ul>
								</td>
								<td>
									{invoice.discount > 0?
										<span>
															<span className="InvoiceTotal">{invoice.total}</span> with discount {invoice.discount}% -
															<span> {roundNumber(invoice.total * getPercentsMultiplier(invoice.discount))}</span>
														</span>
										: <span>{invoice.total}</span>
									}

								</td>
								<td>
									{new Date(invoice.createdAt).toGMTString()}
								</td>
								<td>
									<button className="btn btn-default"
													onClick={() => this.props.onEditInvoice(invoice.id, invoice.customer_id)}>
										<span className="glyphicon glyphicon-edit"></span> Edit
									</button>
								</td>
							</tr>;
		});

		return (
			<table className="table">
				<thead>
				<tr>
					<th>Client</th>
					<th>Invoice items</th>
					<th>Invoice sum $</th>
					<th>Time</th>
					<th>Action</th>
				</tr>
				</thead>

				<tbody>
				{invoices}
				</tbody>
			</table>
		)
	}
}