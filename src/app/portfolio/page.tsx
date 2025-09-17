"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import SideBar from "../sidebar";

// Portfolio categories data
const portfolioCategories = [
	{
		id: "Studio",
		title: "Studio",
		description: "Capturing love and emotion in every frame",
		image: "/portfolio/studio/thumbnail.jpg",
		route: "/portfolio/studio",
	},
	{
		id: "Nature",
		title: "Nature",
		description: "Capturing love and emotion in every frame",
		image: "/portfolio/nature/thumbnail.jpg",
		route: "/portfolio/nature",
	},
	{
		id: "weddings",
		title: "Weddings",
		description: "Capturing love and emotion in every frame",
		image: "/portfolio/wedding/thumbnail.jpg",
		route: "/portfolio/wedding",
	},
	{
		id: "Basketball",
		title: "Basketball",
		description: "Natural moments and everyday beauty",
		image: "/portfolio/basketball/thumbnail.jpg",
		route: "/portfolio/basketball",
	},
	{
		id: "miscsports",
		title: "Sports",
		description: "Capturing love and emotion in every frame",
		image: "/portfolio/sports/thumbnail.jpg",
		route: "/portfolio/sports",
	},

	{
		id: "People",
		title: "People",
		description: "Capturing love and emotion in every frame",
		image: "/portfolio/people/thumbnail.jpg",
		route: "/portfolio/people",
	},
];

export default function Portfolio() {
	const containerRef = useRef<HTMLDivElement>(null);
	const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
	const [imageDimensions, setImageDimensions] = React.useState<{
		[key: string]: { width: number; height: number };
	}>({});
	const [imagesLoaded, setImagesLoaded] = React.useState(0);
	const router = useRouter();

	useEffect(() => {
		// Load images and get their dimensions
		let loadedCount = 0;
		portfolioCategories.forEach((category) => {
			const img = new Image();
			img.onload = () => {
				setImageDimensions((prev) => ({
					...prev,
					[category.id]: { width: img.width, height: img.height },
				}));
				loadedCount++;
				setImagesLoaded(loadedCount);

				// Apply animations when all images are loaded
				if (loadedCount === portfolioCategories.length) {
					setTimeout(() => {
						gsap.fromTo(
							cardsRef.current,
							{
								opacity: 0,
								y: 30,
							},
							{
								opacity: 1,
								y: 0,
								duration: 0.6,
								stagger: 0.1,
								ease: "power2.out",
							}
						);
					}, 100);
				}
			};
			img.src = category.image;
		});
	}, []);

	const handleCardClick = (route: string) => {
		router.push(route);
	};

	const handleCardHover = (index: number, isHover: boolean) => {
		const card = cardsRef.current[index];
		if (!card) return;

		// Simplified hover animation
		gsap.to(card, {
			scale: isHover ? 1.02 : 1,
			duration: 0.2,
			ease: "power1.out",
		});
	};

	return (
		<div className="min-h-screen bg-black text-white">
			<SideBar />
			{/* Main Content */}
			<main className="w-full px-10 md:px-8 py-12">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-4xl font-bold mb-4">Portfolio</h2>
					</div>

					{/* Masonry Grid */}
					<div
						ref={containerRef}
						className="columns-1 md:columns-3 gap-6 space-y-6"
					>
						{portfolioCategories.map((category, index) => {
							// Calculate height based on aspect ratio if dimensions are loaded
							const dimensions = imageDimensions[category.id];
							let cardHeight = 300; // Default height

							if (dimensions) {
								// Use a wider width for aspect ratio calculation since we now have only 3 columns
								const standardWidth = 400; // Wider cards to fill the same space as 4 columns
								const aspectRatio = dimensions.height / dimensions.width;
								cardHeight = Math.round(standardWidth * aspectRatio);
								// Clamp height between reasonable bounds
								cardHeight = Math.max(200, Math.min(800, cardHeight));
							}

							return (
								<div
									key={category.id}
									ref={(el) => {
										cardsRef.current[index] = el;
									}}
									className="break-inside-avoid rounded-xl overflow-hidden shadow-lg cursor-pointer mb-6 relative"
									style={{
										height: `${cardHeight}px`,
									}}
									onClick={() => handleCardClick(category.route)}
									onMouseEnter={() => handleCardHover(index, true)}
									onMouseLeave={() => handleCardHover(index, false)}
								>
									{/* Image */}
									<img
										src={category.image}
										alt={category.title}
										className="w-full h-full object-cover"
										loading="lazy"
									/>

									{/* Title overlay - Top Left */}
									<h3
										style={{
											position: "absolute",
											top: "16px",
											left: "16px",
											color: "white",
											fontWeight: "bold",
											fontSize: "20px",
											margin: 0,
											zIndex: 100,
											textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)",
										}}
									>
										{category.title}
									</h3>
								</div>
							);
						})}
					</div>
				</div>
			</main>
			{/* Footer */}
			<footer className="w-full py-8 px-10 md:px-8 border-t border-white/10 mt-20">
				<div className="max-w-7xl mx-auto text-center">
					<p className="text-white/60">
						&copy; {new Date().getFullYear()} Photography Portfolio &mdash; Crafted
						with passion
					</p>
				</div>
			</footer>
		</div>
	);
}