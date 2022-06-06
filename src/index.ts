import customers from './data/customers.json'
import products from './data/products.json'
import receipts from './data/receipts.json'
import { ByDay, Customer, CustomerReport, Item, Product, Receipt } from './models/models'

export function generateCustomerReport(): Record<string, CustomerReport> {
	let record: Record<string, CustomerReport> = {}

	let allCustomers = getAllCustomers()

	record = getRecords(allCustomers)

	return record
}
generateCustomerReport()

function getRecords(customers: Customer[]): Record<string, CustomerReport> {
	let obj: Record<string, CustomerReport> = {}
	customers.forEach((c) => {
		obj[c.id] = getCustomerReport(c)
	})
	return obj
}

function getAllCustomers(): Customer[] {
	return customers.map((c) => {
		return c
	})
}

function getCustomerReceipts(id: string): Receipt[] {
	return receipts.filter((receipt) => receipt.customerId === id)
}

function getCustomerReport(customer: Customer) {
	let customerReceipts = getCustomerReceipts(customer.id)
	let customerProductIds = getUniqueProductIds(customerReceipts)
	let customerProducts = getCustomerProducts(customerProductIds)
	let customerItems = getCustomerItems(customerProducts, customerReceipts, customer)
	let customerTotal = getTotal(customerItems)
	let customerByDay = getByDay(customerItems)

	let customerReport: CustomerReport = {
		customer,
		items: customerItems,
		total: customerTotal,
		byDay: customerByDay,
	}

	return customerReport
}

function getTotal(customerItems: Item[]) {
	return customerItems.reduce((total, item) => total + item.price * item.quantity, 0)
}

function getByDay(itemArr: Item[]): ByDay {
	let result: ByDay = {}

	let sorted = itemArr.sort((i, j) => (i.createdAt > j.createdAt ? 1 : -1))

	sorted.forEach((item) => {
		let resultKey = item.createdAt.toString().slice(0, 10)
		let resultVal = item.price * item.quantity
		result[resultKey] = resultVal
	})
	return result
}

function getCustomerItems(customerProducts: Record<string, Product>, customerReceipts: Receipt[], customer: Customer): Item[] {
	let arr: Item[] = []

	customerReceipts.forEach((receipt) => {
		let itemObject: Item = {
			customerId: customer.id,
			productId: customerProducts[receipt.productId].id,
			quantity: receipt.quantity,
			createdAt: receipt.createdAt,
			id: customerProducts[receipt.productId].id,
			product: customerProducts[receipt.productId].product,
			price: +customerProducts[receipt.productId].price,
		}
		arr.push(itemObject)
	})

	return arr
}

function getUniqueProductIds(receipts: Receipt[]) {
	let productIds = receipts.map((p) => p.productId)
	return [...new Set(productIds)]
}

function getCustomerProducts(itemIds: string[]): Record<string, Product> {
	let customerProdcuts = products.filter((product) => itemIds.includes(product.id))
	let record: Record<string, Product> = {}
	customerProdcuts.forEach((p) => (record[p.id] = p))
	return record
}
