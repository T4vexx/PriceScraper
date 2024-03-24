import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import Image from "next/image";

const Home = () => {
	return (
		<>
			<section className="px-6 md:px-20 py-24">
				<div className="flex max-xl:flex-col gap-16">
					<div className="flex flex-col justify-center">
						<p className="small-text">
							Compras Inteligentes começam aqui:
							<Image
								src="/assets/icons/arrow-right.svg"
								alt="arrow-right"
								width={16}
								height={16}
							/>
						</p>
						<h1 className="head-text">
							Desbloquei o poder da compra com{" "}
							<span className="text-primary">PriceWise</span>
						</h1>
						<p className="mt-6">
							Poderosa ferramenta de análises de produto e crescimento poderosas
							e auto-serviço para ajudá-lo a converter, engajar e reter mais.
						</p>
						<Searchbar />
					</div>
					<HeroCarousel />
				</div>
			</section>

			<section className="trending-section">
				<h2 className="section-text">Em alta</h2>

				<div className="flex flex-wrap gap-x-8 gap-y-16">
					{["Apple iphone 15", "The art of war", "Gucci tênis"].map(
						(product) => (
							<div key={product}>{product}</div>
						)
					)}
				</div>
			</section>
		</>
	);
};

export default Home;
