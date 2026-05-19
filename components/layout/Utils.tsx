import Image from 'next/image';
const Star = ({ filled }: { filled: boolean }) => (
    <svg
        className="w-5 h-5"
        fill={filled ? 'gold' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-9.19-.64L12 2 10.18 8.6 1 9.24l7.46 4.73L5.82 21z"
        />
    </svg>
);

export function HealthRating({ rating }: { rating: number }) {
    const stars = Array.from({ length: 5 }, (_, index) => index < rating);
    return (
        <div className="flex">
            {stars.map((filled, index) => (
                <Star key={index} filled={filled} />
            ))}
        </div>
    );
};

export function HeroSection({ title, description, image }: { title: string; description: string, image: string }) {
    return (
        <section className="relative h-[40vh]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white">
                            <h1 className="text-5xl font-bold mb-4">{title}</h1>
                            <p className="text-xl max-w-2xl mx-auto font-josefin">
                                {description}
                            </p>
                        </div>
                    </div>
                    <div className="absolute inset-0 shadow-lg" />
                </section>
    );
};