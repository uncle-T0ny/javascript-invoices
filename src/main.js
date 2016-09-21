import 'babel-polyfill'
import React from 'react'
import {render} from 'react-dom'
import App from './containers/App'
import Customers from './components/Customers'
import Products from './components/Products'
import Invoices from './components/Invoices'
import NoMatch from './components/NoMatch'

import {Router, Route, IndexRoute, hashHistory} from 'react-router'

render(
	<Router history={hashHistory} >
		<Route path='/' component={App}>
			<IndexRoute component={Invoices}/>
			<Route path='customers' component={Customers}/>
			<Route path='products' component={Products}/>
			<Route path="*" component={NoMatch}/>
		</Route>
	</Router>,
	document.getElementById('root')
)