export interface Customer {
	id: string
	firstName: string
	lastName: string
}

export interface Item {
	customerId: string
	productId: string
	quantity: number
	createdAt: string
	id: string
	product: string
	price: number
}

export interface ByDay {
	[day: string]: number
}

export interface CustomerReport {
	customer: Customer
	items: Item[]
	total: number
	byDay: ByDay
}

export interface Product {
	id: string
	product: string
	price: string
}

export interface Receipt {
	customerId: string
	productId: string
	quantity: number
	createdAt: string
}
