import axios from "axios";
import * as cheerio from "cheerio";
import {
	extractBrand,
	extractCurrency,
	extractDescription,
	extractPrice,
	extractReviewsCount,
	extractStars,
	formatNumber,
} from "../utils";

export async function scrapeAmazonProduct(url: string) {
	if (!url) return;

	const username = String(process.env.BRIGHT_DATA_USERNAME);
	const password = String(process.env.BRIGHT_DATA_PASSWORD);
	const port = 22225;
	const session_id = (1000000 * Math.random()) | 0;
	const options = {
		auth: {
			username: `${username}-session-${session_id}`,
			password,
		},
		host: "brd.superproxy.io",
		port,
		rejectUnauthorized: false,
	};

	try {
		const response = await axios.get(url, options);
		const $ = cheerio.load(response.data);

		const title = $("#productTitle").text().trim();
		const currentPrice = extractPrice(
			$(".priceToPay span.a-price-whole"),
			$("a.size.base.a-color-price"),
			$(".a-button-selected .a-color-base"),
			$("#price")
		);

		const originalPrice = extractPrice(
			$("#priceblock_ourprice"),
			$(".a-price.a-text-price span.a-offscreen"),
			$("#listPrice"),
			$("#priceblock_dealprice"),
			$(".a-size-base.a-color-price")
		);

		const isStock =
			$("#availability span").text().trim().toLowerCase() === "em estoque";

		const images =
			$("#imgBlkFront").attr("data-a-dynamic-image") ||
			$("#landingImage").attr("data-a-dynamic-image") ||
			"{}";

		const imagesUrls = Object.keys(JSON.parse(images));
		const currency = extractCurrency($(".a-price-symbol"));
		const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "");
		const reviewsCount = extractReviewsCount(
			$(".averageStarRatingNumerical > span")
		);
		const stars = extractStars(
			$(".reviewCountTextLinkedHistogram.noUnderline")
		);
		const brand = extractBrand($("#bylineInfo"));
		const description = extractDescription($);

		const data = {
			url,
			currency: currency ?? "R",
			image: imagesUrls[0],
			currentPrice: currentPrice || originalPrice,
			originalPrice: originalPrice || currentPrice,
			priceHistory: [],
			discountRate: Number(discountRate),
			brand,
			title,
			reviewsCount: reviewsCount,
			stars,
			description,
			isOutOfStock: !isStock,
			lowestPrice: currentPrice || originalPrice,
			highestPrice: originalPrice || currentPrice,
			averagePrice: currentPrice || originalPrice,
		};

		return data;
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (e: any) {
		throw new Error(`Failed to scrape product: ${e.message}`);
	}
}
