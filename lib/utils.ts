import type { PriceHistoryItem, Product } from "../types";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const extractReviewsCount = (element: any) => {
	return element.text().trim().replace(/[^\d]/g, "");
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const extractStars = (element: any) => {
	const stars = element
		.attr("title")
		?.trim()
		.replace(/[^\d.,]/g, " ")
		.split(" ");
	return stars?.[0] ? stars[0] : 4.5;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const extractBrand = (element: any) => {
	const brand = element.text().trim().split(":");
	return brand?.[1] ? brand[1].trim() : "Sem marca";
};

const Notification = {
	WELCOME: "WELCOME",
	CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
	LOWEST_PRICE: "LOWEST_PRICE",
	THRESHOLD_MET: "THRESHOLD_MET",
};

const THRESHOLD_PERCENTAGE = 40;

// Extracts and returns the price from a list of possible elements.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function extractPrice(...elements: any) {
	for (const element of elements) {
		const priceText = element.text().trim();

		if (priceText) {
			const cleanPrice = priceText.replace(/[^\d.,]/g, "");
			console.log(cleanPrice);
			// biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
			let firstPrice;

			if (cleanPrice) {
				firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0];
			}

			return firstPrice || cleanPrice;
		}
	}

	return "";
}

// Extracts and returns the currency symbol from an element.
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function extractCurrency(element: any) {
	const currencyText = element.text().trim().slice(0, 1);
	return currencyText ? currencyText : "";
}

// Extracts description from two possible elements from amazon
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function extractDescription($: any) {
	// these are possible elements holding description of the product
	const selectors = [
		".a-unordered-list .a-list-item",
		".a-expander-content p",
		// Add more selectors here if needed
	];

	for (const selector of selectors) {
		const elements = $(selector);
		if (elements.length > 0) {
			const textContent = elements
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				.map((_: any, element: any) => $(element).text().trim())
				.get()
				.join("\n");
			return textContent;
		}
	}

	// If no matching elements were found, return an empty string
	return "";
}

export function getHighestPrice(priceList: PriceHistoryItem[]) {
	let highestPrice = priceList[0];

	for (let i = 0; i < priceList.length; i++) {
		if (priceList[i].price > highestPrice.price) {
			highestPrice = priceList[i];
		}
	}

	return highestPrice.price;
}

export function getLowestPrice(priceList: PriceHistoryItem[]) {
	let lowestPrice = priceList[0];

	for (let i = 0; i < priceList.length; i++) {
		if (priceList[i].price < lowestPrice.price) {
			lowestPrice = priceList[i];
		}
	}

	return lowestPrice.price;
}

export function getAveragePrice(priceList: PriceHistoryItem[]) {
	const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0);
	const averagePrice = sumOfPrices / priceList.length || 0;

	return averagePrice;
}

// export const getEmailNotifType = (
// 	scrapedProduct: Product,
// 	currentProduct: Product
// ) => {
// 	const lowestPrice = getLowestPrice(currentProduct.priceHistory);

// 	if (scrapedProduct.currentPrice < lowestPrice) {
// 		return Notification.LOWEST_PRICE as keyof typeof Notification;
// 	}
// 	if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
// 		return Notification.CHANGE_OF_STOCK as keyof typeof Notification;
// 	}
// 	if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
// 		return Notification.THRESHOLD_MET as keyof typeof Notification;
// 	}

// 	return null;
// };

export const formatNumber = (num: number) => {
	return num.toLocaleString("pt-BR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	});
};
