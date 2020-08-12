const Filters = require('./Filters')
const cogs = require('../config')
module.exports = {
	statusColors: {
		pennding: '#ffc107',
		approved: '#66bb6a',
		rejected: '#f44336',
		canceled: '#f44336',
	},
	getItems(items) {
		const result = []
		let i
		for (i = 0; i < items.length; i += 1) {
			result.push(`
				<tr style = "background-color: #f8f8f9; text-alignment: center">
					<td style = "text-alignment: center">${items[i].count}</td>
					<td style = "text-alignment: center">${items[i].name} </td>
					<td style = "text-alignment: center"> ${items[i].size} </td>
					<td style = "text-alignment: center"> ${items[i].selectedColor}</td>
					<td style = "text-alignment: center"> ${items[i].price} </td>
				</tr>
				`)
		}
		return `
		<table style = "width: 100%; text-alignment: center">
			<tr style = "background-color: #2a0d45; color: white; height: 60px;">
				<th>Count</th>
				<th>Item</th>
				<th>Size</th>
				<th>Color</th>
				<th>Price</th>
			</tr>
			${ result.join('') }
		</table>
		`
	},
	orderPlaced(order) {
		return `
		<p>
			Thanks for your order, <b style = "color: #2a0d45;">${order.user.name}!</b><br>
		    ${ 
		    	order.status.toLowerCase() === 'pennding' ?
		           'You can cancel or edit your order items or delivery address before order is approved, other wise, cancelation is not available.<br>' : ''
		     }
			Order Number: <b> #${order.order_no}</b><br>
			Total price: <b>${order.cart.total} LE</b><br>
			Order Status: <b style = "color: ${ this.statusColors[ order.status.toLowerCase() ] }">${ Filters.CapitalizeFirst(order.status) }</b><br>
			Delivery Address:
			<small>${ order.delivery_address.building }, ${ order.delivery_address.street }, ${ order.delivery_address.text_data.area }, ${ order.delivery_address.text_data.city }</small><br>
			Orderd Items:<br>
			${ this.getItems(order.cart.items) }
			<br>
			<a style = "text-decoration: none; color: #2a0d45" href = "${ cogs.website }/profile/orders/${ order.order_no }"> Check it out <b style = "color: #2196f3">here!</b> </a><br>
			<small style = "color: #ff1744">
			  Please notice that delivery duration takes from 2 to 5 days in Cairo and Alexandria and 4 to 7 days in other cities. <br>
			  Also notice that there is No Replacement or Refund.
			</small><br>
			Best Regards<br>
			<b style = "color: #2a0d45; font-family: monospace">DesignKaf</b>
		</p>
		`
	},
	orderCanceled(order) {
		return `
		<p>
			Your order was canceled successfully<br>
			Order Number: <b> #${order.order_no}</b><br>			
			Order Status: <b style = "color: ${ this.statusColors[ order.status.toLowerCase() ] }">${ Filters.CapitalizeFirst(order.status) }</b><br>
			Thanks for using <span style = "color: #2a0d45; font-family: monospace">DesignKaf</span><br><br>
			Best Regards<br>
			<b style = "color: #2a0d45; font-family: monospace">DesignKaf</b>
		</p>
		`	
	},
	welcomeUser(user) {
		return `
		Hello, <b style = "color: #2a0d45;">${user.name}!</b><br>
		Your  <span style = "color: #2a0d45; font-family: monospace">DesignKaf</span> Account was registered successfully.<br>
		<a style = "text-decoration: none; color: #2a0d45" href = "${ cogs.website }/verify?t=${ user.token }">
		  Please click <b style = "color: #2196f3">This Link</b> to verify your email.
	    </a>
		<br><br>
		Thanks for using <span style = "color: #2a0d45; font-family: monospace">DesignKaf</span><br><br>
		Best Regards<br>
		<b style = "color: #2a0d45; font-family: monospace">DesignKaf</b>
		`
	}
}