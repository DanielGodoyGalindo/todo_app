import Link from "next/link";
import BackButton from "../../components/backButton"
import AuthButton from "../../components/AuthButton"

// Route: app/news/[page]/page.jsx
// Dynamically generates a news page based on the "page" URL parameter, using ISR (Incremental Static Regeneration).
// The "params.page" value determines which page number is rendered.

async function getNews(page = 1) {
    // https://newsapi.org/docs/endpoints/sources
    const res = await fetch(
        `https://newsapi.org/v2/everything?q=technology&pageSize=6&page=${page}&sortBy=publishedAt&language=es`,
        {
            headers: { Authorization: `Bearer ${process.env.NEWS_API_KEY}` },
            next: { revalidate: 5 * 60 }, // refresh every 5 mins
            // cache: "no-store" // always check for new content
        }
    );

    if (!res.ok) throw new Error("Failed to fetch news");
    const data = await res.json();
    return data.articles;
}

export default async function NewsPage({ params }) {
    const resolvedParams = await params; // first await for params
    const page = parseInt(resolvedParams.page, 10) || 1;
    const articles = await getNews(page);

    return (
        <div>
            <BackButton />
            <AuthButton />
            <main className="pb-6 pl-6 pr-6 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">News App 📰 Page {page}</h1>

                {/* News grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, i) => (
                        <article key={i} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition">
                            {article.urlToImage && (<img src={article.urlToImage} alt={article.title} className="w-full h-40 object-cover" />)}
                            <div className="p-4">
                                <h2 className="font-semibold text-lg mb-2">{article.title}</h2>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{article.description}</p>
                                <Link href={article.url} target="_blank" className="text-emerald-600 hover:underline">
                                    Read more →
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            {/* Pagination */}
            <div className="flex justify-center mb-6 gap-4">
                {page > 1 && (<Link href={`/news/${page - 1}`} className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300">
                    ← Previous
                </Link>
                )}
                <Link href={`/news/${page + 1}`} className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600">
                    Next →
                </Link>
            </div>
        </div>
    );
}
