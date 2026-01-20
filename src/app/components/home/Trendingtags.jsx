"use client";
import React, { useEffect, useState } from "react";
import { getTrendingListings } from "../../api/homeAPI";
import { useRouter } from "next/navigation";

const CARD_COLORS = [
  "bg-[var(--color-accent-900)]",
  "bg-[var(--color-accent-800)]",
  "bg-[var(--color-accent-700)]",
  "bg-[var(--color-accent-600)]",
  "bg-[var(--color-accent-800)]",
  "bg-[var(--color-accent-900)]",
  "bg-[var(--color-accent-700)]", // Extra color for 7th item
];

export default function ExpandableServices() {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState({});
  const [cards, setCards] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  const handleClick = (subcategoryId) => {
    if (!subcategoryId) return;
    router.push(`/categories/subcategory/${subcategoryId}/listings`);
  };

  useEffect(() => {
    async function fetchTrending() {
      try {
        const res = await getTrendingListings();
        const rep = res?.data?.data?.listings || [];

        // Create a Set to track unique titles
        const seenTitles = new Set();
        const uniqueCards = [];
        
        // Get up to 7 items, but ensure they're unique
        for (const item of rep) {
          const title = item.subcategory || item.title;
          
          // Skip if title already exists or is undefined/empty
          if (!title || seenTitles.has(title)) continue;
          
          seenTitles.add(title);
          
          uniqueCards.push({
            title: title,
            description:
              item.subcategory_description ||
              item.description ||
              "No description available",
            img:
              item.subcategory_image ||
              item.images?.[0] ||
              "/no-image.png",
            trend: `+${Math.floor(Math.random() * 80) + 20}%`,
            color: CARD_COLORS[uniqueCards.length % CARD_COLORS.length],
            subcategory_id: item.subcategory_id,
          });
          
          // Stop when we have 7 unique items
          if (uniqueCards.length >= 7) break;
        }

        // If we don't have enough unique items, add fallbacks
        if (uniqueCards.length < 6) {
          const fallbackTitles = [
            "Web Development",
            "Digital Marketing", 
            "Graphic Design",
            "Content Writing",
            "SEO Services",
            "Mobile Apps",
            "UI/UX Design"
          ];
          
          for (let i = uniqueCards.length; i < 6; i++) {
            const fallbackTitle = fallbackTitles[i] || `Service ${i + 1}`;
            if (!seenTitles.has(fallbackTitle)) {
              uniqueCards.push({
                title: fallbackTitle,
                description: "Premium service available for your business needs",
                img: `/104.jpeg`,
                trend: `+${Math.floor(Math.random() * 80) + 20}%`,
                color: CARD_COLORS[i % CARD_COLORS.length],
                subcategory_id: `fallback-${i}`,
              });
            }
          }
        }

        setCards(uniqueCards);
      } catch (error) {
        console.error("Error fetching trending listings:", error);
        
        // Fallback data if API fails
        const fallbackCards = [
          { title: "Web Development", description: "Custom websites and web applications", img: "/web-dev.jpg", trend: "+65%", color: CARD_COLORS[0], subcategory_id: "1" },
          { title: "Digital Marketing", description: "Social media and online marketing strategies", img: "/digital-marketing.jpg", trend: "+72%", color: CARD_COLORS[1], subcategory_id: "2" },
          { title: "Graphic Design", description: "Logo, branding, and visual identity design", img: "/graphic-design.jpg", trend: "+58%", color: CARD_COLORS[2], subcategory_id: "3" },
          { title: "Content Writing", description: "Blog posts, articles, and SEO content", img: "/content-writing.jpg", trend: "+45%", color: CARD_COLORS[3], subcategory_id: "4" },
          { title: "Mobile Apps", description: "iOS and Android app development", img: "/mobile-apps.jpg", trend: "+81%", color: CARD_COLORS[4], subcategory_id: "5" },
          { title: "SEO Services", description: "Search engine optimization and ranking", img: "/seo-services.jpg", trend: "+67%", color: CARD_COLORS[5], subcategory_id: "6" },
        ];
        setCards(fallbackCards);
      }
    }

    fetchTrending();
  }, []);

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleImageLoad = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  // Mobile view - Simple boxes with names only
  if (isMobile) {
    return (
      <section className="py-8 bg-[var(--color-accent-200)]">
        <h2 className="text-3xl text-center font-semibold text-[var(--color-black-darker)] mb-6">
          Trending Services
        </h2>

        <div className="px-4">
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
            {cards.map((c, i) => (
              <div
                key={i}
                onClick={() => handleClick(c.subcategory_id)}
                className={`
                  flex-shrink-0 w-32 h-32 rounded-xl relative overflow-hidden cursor-pointer
                  transition-all duration-300 hover:scale-105 active:scale-95
                  ${c.color}
                `}
              >
                {/* Background Image with Overlay */}
                <img
                  src={c.img}
                  alt={c.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-50" />
                
                {/* Content */}
                <div className="relative h-full flex items-center justify-center p-3">
                  <h3 className="text-white font-semibold text-center text-sm leading-tight line-clamp-3">
                    {c.title}
                  </h3>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${c.color}`} />
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </section>
    );
  }

  // Desktop view - Original expandable cards
  return (
    <section className="py-10 bg-[var(--color-accent-200)]">
      <h2 className="text-center font-sans text-3xl font-semibold text-[var(--color-black-darker)] mb-15">
        Trending Services
      </h2>

      <div className="max-w-7xl mx-auto px-6 flex gap-4">
        {/* LEFT TEXT */}
        <div className="w-1/4 flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-2 text-[var(--color-black-darker)]">
            Great Business Opportunities
          </h2>
          <p className="text-[var(--color-black-light)] font-semibold leading-relaxed">
            Discover trending services from verified experts. Expand your
            business opportunities with AI, development, tech & creative fields.
          </p>
        </div>

        {/* SMALLER CARDS */}
        <div className="w-3/4 h-[360px] flex gap-2">
          {cards.map((c, i) => (
            <div
              key={i}
              onMouseEnter={() => setExpandedIndex(i)}
              className={`relative rounded-xl overflow-hidden cursor-pointer
                transition-all duration-[900ms]
                ${expandedIndex === i ? "flex-[4]" : "flex-[1.5]"}
              `}
            >
              {/* IMAGE */}
              <img
                src={c.img}
                alt={c.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1000ms]
                  ${expandedIndex === i ? "scale-100" : "scale-105"}
                  ${loadedImages[i] ? "opacity-100" : "opacity-0"}
                `}
                onLoad={() => handleImageLoad(i)}
              />

              {/* BLACK OVERLAY */}
              <div
                className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                  expandedIndex === i ? "opacity-40" : "opacity-60"
                }`}
              />

              {/* COLOR OVERLAY */}
              <div className={`absolute inset-0 ${c.color} opacity-60`} />

              <div className="relative h-full flex flex-col justify-between p-4">
                {/* COLLAPSED VIEW */}
                <div
                  className={`transition-all duration-500 ${
                    expandedIndex === i
                      ? "opacity-0 invisible"
                      : "opacity-100 visible"
                  }`}
                >
                  <h3 className="text-sm text-white font-semibold whitespace-nowrap rotate-180 writing-mode-vertical">
                    {c.title}
                  </h3>
                </div>

                {/* EXPANDED VIEW */}
                <div
                  className={`transition-all duration-500 ${
                    expandedIndex === i
                      ? "opacity-100 visible"
                      : "opacity-0 invisible absolute"
                  }`}
                >
                  <h3 className="text-2xl font-semibold text-white mb-2 drop-shadow">
                    {c.title}
                  </h3>
                  <p className="text-xs text-white font-medium mb-3 max-w-xs leading-snug">
                    {c.description}
                  </p>

                  <button
                    onClick={() => handleClick(c.subcategory_id)}
                    className="bg-white text-gray-900 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-100 transition"
                  >
                    Explore Now
                  </button>
                </div>
              </div>

              {/* Bottom Line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 ${c.color}
                  transition-all duration-500
                  ${expandedIndex === i ? "opacity-100" : "opacity-0"}
                `}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .writing-mode-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </section>
  );
}