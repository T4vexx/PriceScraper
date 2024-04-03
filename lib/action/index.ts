"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import type { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl: string) {
	if (!productUrl) return;

	try {
		connectToDB();

		const scrapedProduct = await scrapeAmazonProduct(productUrl);

		if (!scrapedProduct) return;

		let product = scrapedProduct;

		const existingProduct = await Product.findOne({ url: scrapedProduct.url });

		if (existingProduct) {
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			const updatedPriceHistory: any = [
				...existingProduct.priceHistory,
				{ price: scrapedProduct.currentPrice },
			];

			product = {
				...scrapedProduct,
				priceHistory: updatedPriceHistory,
				lowestPrice: getLowestPrice(updatedPriceHistory),
				highestPrice: getHighestPrice(updatedPriceHistory),
				averagePrice: getAveragePrice(updatedPriceHistory),
			};
		}

		const newProduct = await Product.findOneAndUpdate(
			{ url: scrapedProduct.url },
			product,
			{ upsert: true, new: true }
		);

		revalidatePath(`/products/${newProduct._id}`);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		throw new Error(`Failed to create/update product: ${error.message}`);
	}
}

export async function getProductById(productId: string) {
	try {
		connectToDB();

		const product = await Product.findOne({ _id: productId });

		if (!product) return null;

		return product;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log(error);
	}
}

export async function getAllProducts() {
	try {
		connectToDB();

		const product = await Product.find();

		return product;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log(error);
	}
}

export async function getSimilarProduct(productId: string) {
	try {
		connectToDB();

		const product = await Product.findById(productId);
		if (!product) return null;

		const similarProducts = await Product.find({
			_id: { $ne: productId },
		}).limit(3);

		return similarProducts;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log(error);
	}
}

export async function addUserEmailToProduct(
	productId: string,
	userEmail: string
) {
	try {
		const product = await Product.findById(productId);
		if (!product) return;

		const userExists = product.users.some(
			(user: User) => user.email === userEmail
		);

		if (!userExists) {
			product.users.push({ email: userEmail });

			await product.save();
			const emailContent = generateEmailBody(product, "WELCOME");
			await sendEmail(emailContent, [userEmail])
		}
	} catch (error) {
		console.log(error);
	}
}
