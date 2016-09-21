import React, {Component} from 'react'

export default class AddedProductsTable extends Component {


	render() {
		return (
			<table className="table">
				<thead>
				<tr>
					<th>Product</th>
					<th>Amount</th>
					<th>Price</th>
					{this.props.editableInvoice.isNewInvoice?
						<th>Action</th>
						: null}
				</tr>
				</thead>

				<tbody>
				{this.props.addedProducts.map((product) => {
					return 	<tr key={"product_row_"  + Math.random()}>
						<td>
							{product.productName}
						</td>
						<td>
							<input className="form-control"
										 type="number"
										 onChange={(event) => this.props.changeProductAmount(parseFloat(event.target.value), product.productId)}
										 value={product.amount}/>
						</td>
						<td>
							{product.productPrice}$
						</td>
						{this.props.editableInvoice.isNewInvoice?
							<td>
									<button onClick={() => this.props.removeProduct(product.productId)}
													className="btn btn-default">
										<span className="glyphicon glyphicon-remove"></span>
									</button>
							</td>
							: null}
					</tr>
				})}
				</tbody>
			</table>
		)
	}
}