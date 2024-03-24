"use server";

import { scapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl: string) {
	if (!productUrl) return;

	try {
		const scrapedProduct = await scapeAmazonProduct(productUrl)

	  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (e: any) {
		console.log(e);
		throw new Error(`Failed to create/update product: ${e.message}`);
	}
}
