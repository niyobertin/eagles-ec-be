import stripe from "../config/stripe";
import { CartAttributes } from "../sequelize/models/Cart";
import OrderItem from "../sequelize/models/orderItems";
import Order from "../sequelize/models/orders";
import { UserAttributes } from "../sequelize/models/users";
import Product from "../sequelize/models/products";


export const getOrCreateCustomer = async (user: UserAttributes) => {
	try {
		const existing = await stripe.customers.list({ email: user.email });
		if (existing.data.length > 0) {
			return existing.data[0];
		} else {
			const customer = await stripe.customers.create({
				name: `${user.name}`,
				email: user.email,
			});
			return customer;
		}
	} catch (error: any) {
		throw new Error("Error while creating customer " + error.message)
	}
};


export const makeLineItems = (cart: CartAttributes) => {
	const lineItems = [];
	const items: any = cart.items;
	for (const item of items) {
		const lineItem = {
			price_data: {
				currency: "rwf",
				product_data: {
					name: item.product.name,

				},
				unit_amount: item.product.price,
			},
			quantity: item.quantity,
		};
		lineItems.push(lineItem);
	}
	return lineItems;
};

export const placeOrder = async (cart: CartAttributes) => {
	const currentDate = new Date(Date.now());
	const deliveryDate = new Date(currentDate.setDate(currentDate.getDate() + 3));
	//@ts-ignore
	const order = await Order.create({ buyerId: cart.userCart.userId,
		deliveryDate
	})
	//@ts-ignore
	const items = cart.userCart.items;
	for(const item of items){
		const cartItem = await OrderItem.create(
			{
				orderId: order.id as number,
				productId: item.productId,
				quantity: item.quantity
			}
		)
	};
	const ordered = await Order.findOne({
		where: { id: order.id }, include: [
			{
				model: OrderItem,
				as: "items", include: [{
					model: Product,
					as: "product",
				},]
			},
		],
	})
	return ordered;
}