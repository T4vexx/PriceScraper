"use client";
import { scrapeAndStoreProduct } from "@/lib/action";
import { type FormEvent, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isValidAmazonProductUrl = (url: string): boolean => {
	try {
		const parsedUrl = new URL(url);
		const hostname = parsedUrl.hostname;

		if (
			hostname.includes("amazon.com") ||
			hostname.includes("amazon.") ||
			hostname.endsWith("amazon")
		) {
			return true;
		}
	} catch (e) {
		console.log(e);
		return false;
	}
	return false;
};

const Searchbar = () => {
	const [searchPrompt, setSeearchPrompt] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const isValidLink = isValidAmazonProductUrl(searchPrompt);

		if (!isValidLink)
			return toast.warning("Por favor use apenas links da amazon!");

		try {
			setIsLoading(true);
			const product = await scrapeAndStoreProduct(searchPrompt);
		} catch (e) {
			console.log(e);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				closeOnClick
				rtl={false}
				theme="light"
			/>
			<input
				type="text"
				value={searchPrompt}
				onChange={(e) => setSeearchPrompt(e.target.value)}
				placeholder="Coloque o link do produto"
				className="searchbar-input"
			/>
			<button
				type="submit"
				disabled={isLoading || searchPrompt === ""}
				className="searchbar-btn"
			>
				{isLoading ? "Buscando..." : "Buscar"}
			</button>
		</form>
	);
};

export default Searchbar;
