import React, {Component} from 'react'
import Select2 from 'react-select2-wrapper';
import AddedProductsTable from './AddedProductsTable';
import {roundNumber, getPercentsMultiplier} from '../util/util';
import {createInvoice, updateInvoice, createInvoiceItem, updateInvoiceItem} from '../api/api';

export default class InvoiceForm extends Component {

	constructor(props) {
		super(props);

		this.state = {
			addedProducts: [],
			customerId: -1,
			chosenProductId: -1,
			discount: 0
		};

		this.removeProduct = this.removeProduct.bind(this);
		this.addProduct = this.addProduct.bind(this);
		this.changeProductAmount = this.changeProductAmount.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (!nextProps.editableInvoice.isNewInvoice) {
			this.setUpCurrentInvoice(nextProps.editableInvoice)
		}
	}

	componentWillMount() {
		if (!this.props.editableInvoice.isNewInvoice) {
			this.setUpCurrentInvoice(this.props.editableInvoice)
		}
	}

	setUpCurrentInvoice(editableInvoice) {
		let invoiceId = editableInvoice.editableInvoiceId;
		let invoice = this.props.invoicesById[invoiceId];
		let invoiceItems = this.props.invoiceItemsById[invoiceId];
		let products = [];
		let self = this;
		invoiceItems.forEach((item) => {
			let product = self.props.productsById[item.product_id];
			let addedProduct = {
				productId: product.id,
				amount: item.quantity,
				productPrice: product.price,
				productName: product.name,
				itemId: item.id
			};
			products.push(addedProduct);
		});

		this.setState({
			customerId: editableInvoice.editableInvoiceCustomerId,
			discount: invoice.discount,
			addedProducts: products
		});
	}

	getCustomersForSelector() {
		return this.props.customers.map((customer) => {
			return {
				id : customer.id,
				text: customer.name
			}
		});
	}

	getProductsForSelector() {
		return this.props.products.map((products) => {
			return {
				id : products.id,
				text: products.name + " " + products.price + "$"
			}
		});
	}

	addProduct() {

		let product = this.props.productsById[parseInt(this.refs.productSelector.el.val())];

		let newProduct = {
			productId: product.id,
			amount: parseFloat(this.refs.productAmount.value),
			productPrice: product.price,
			productName: product.name
		};

		let addedProducts = this.state.addedProducts;
		addedProducts.push(newProduct);
		this.setState({
			addedProducts: addedProducts,
			chosenProductId: -1
		});
	}

	removeProduct(productId) {
		let addedProducts = this.state.addedProducts;
		addedProducts = addedProducts.filter((product) => {
			if (product.productId == productId) {
				return;
			} else {
				return product;
			}
		});

		this.setState({
			addedProducts: addedProducts,
		});
	}

	onCustomerSelect() {
		this.setState({
			customerId: parseInt(this.refs.customerSelector.el.val()),
		});
	}

	onProductSelect() {
		this.setState({
			chosenProductId: parseInt(this.refs.productSelector.el.val()),
		});
	}

	changeProductAmount(newAmount, productId) {
		let addedProducts = this.state.addedProducts;
		addedProducts = addedProducts.map((product) => {
			if (product.productId == productId) {
				product.amount = newAmount;
			}
			return product;
		});
		this.setState({addedProducts: addedProducts});
	}

	onChangeDiscount(event) {
		let newDiscount = event.target.value;
		this.setState({
			discount: parseFloat(newDiscount)
		});
	}

	getTotalSum(notCalculateDiscount) {
		let sum = 0;
		let discountMultiplier = 1;
		if (this.state.discount > 0 && !notCalculateDiscount) {
			discountMultiplier = getPercentsMultiplier(this.state.discount);
		}

		this.state.addedProducts.forEach((product) => {
			sum += product.amount * product.productPrice * discountMultiplier;
		});

		return roundNumber(sum);
	}

	modifyInvoice() {
		let invoice = {
			customer_id: this.state.customerId,
			discount: this.state.discount,
			total: this.getTotalSum(true)
		};

		let invoiceItems = [];
		this.state.addedProducts.forEach((product) => {
			invoiceItems.push({
				product_id: product.productId,
				quantity: product.amount,
				itemId: product.itemId,
			});
		});

		let self = this;
		if (this.props.editableInvoice.isNewInvoice) {
			createInvoice(invoice, (savedInvoice) => {
				invoiceItems.forEach((invoiceItem, idx) => {
					let savedLastInvoiceItem = ((idx + 1) == invoiceItems.length);
					invoiceItem["invoice_id"] = savedInvoice.id;

					createInvoiceItem(savedInvoice.id, invoiceItem, () => {
						if (savedLastInvoiceItem) {
							self.props.onChangeEntriesState();
							self.setState({
								addedProducts: [],
								customerId: -1,
								chosenProductId: -1
							});
							self.props.afterInvoiceModification();
						}
					})
				});
			});
		} else {
			updateInvoice(this.props.editableInvoice.editableInvoiceId, invoice, (updatedInvoice) => {
				invoiceItems.forEach((invoiceItem, idx) => {
					let updatedLastInvoiceItem = ((idx + 1) == invoiceItems.length);
					invoiceItem["invoice_id"] = updatedInvoice.id;

					updateInvoiceItem(updatedInvoice.id, invoiceItem.itemId, invoiceItem, () => {
						if (updatedLastInvoiceItem) {
							self.props.onChangeEntriesState();
							self.setState({
								addedProducts: [],
								customerId: -1,
								chosenProductId: -1
							});
							self.props.afterInvoiceModification();
						}
					})
				});
			});
		}

	}

	render() {
		return (
			<div className="Invoices__newInvoiceBlock">

				<div className="row">
					<div className="form-group col-md-6">

						<label>Client:</label>

						<Select2 className="selector form-control"
										 ref="customerSelector"
										 value={this.state.customerId}
										 data={this.getCustomersForSelector()}
										 options={{
											 placeholder: 'search client',
										 }}
										 onSelect={() => this.onCustomerSelect()}
						/>
					</div>

					<div className="form-group col-md-6">

						<label>Product:</label>


						<Select2 className="selector form-control"
										 ref="productSelector"
										 value={this.state.chosenProductId}
										 data={this.getProductsForSelector()}
										 options={{
											 placeholder: 'search product',
										 }}
										 onSelect={() => this.onProductSelect()}
						/>

					</div>
				</div>

				<div className="row">
					<div className="form-group col-md-4">
						<label>Amount:</label>
						<input className="form-control"
									 defaultValue={1}
									 min={0}
									 ref="productAmount"
									 type="number"
									 placeholder="amount"/>
					</div>
				</div>

				<div className="row">
					<div className="form-group col-md-4">
						<label>Discount:</label>
						<input className="form-control"
									 value={this.state.discount}
									 onChange={(event) => this.onChangeDiscount(event)}
									 ref="customerDiscount"
									 type="number"
									 min={0}
									 max={100}
									 placeholder="discount"/>

					</div>
				</div>

				<button className="btn btn-default"
								onClick={() => this.addProduct()}>
					<span className="glyphicon glyphicon-plus"></span> Add product
				</button>

				<br/>
				<hr/>

				{this.state.addedProducts.length > 0?
					<div>
						<AddedProductsTable addedProducts={this.state.addedProducts}
																changeProductAmount={this.changeProductAmount}
																removeProduct={this.removeProduct}
																editableInvoice={this.props.editableInvoice}/>



						<div className="TotalSum">
							total: {this.getTotalSum()} (discount {this.state.discount} %)
						</div>

						<button className="btn btn-default"
										onClick={() => this.modifyInvoice()}>
							{this.props.editableInvoice.isNewInvoice? "Create invoice" : "Update invoice"}

						</button>
					</div>
					: null}

			</div>
		)
	}
}