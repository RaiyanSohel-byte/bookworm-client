"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  History,
  Bookmark,
  BookmarkPlus,
  Star,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import api from "@/app/lib/api";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

const BookDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  const [shelf, setShelf] = useState(""); // "want", "reading", "read"
  const [progress, setProgress] = useState({ pagesRead: 0, totalPages: 0 });

  const [recommended, setRecommended] = useState([]);
  const [shelves, setShelves] = useState({ want: [], reading: [], read: [] });

  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString());
  }, []);

  // Fetch book, reviews, recommendations, and user shelves
  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to load book", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews?bookId=${id}&status=approved`);
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to load reviews", err);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const res = await api.get("/recommendations");
        setRecommended(res.data);
      } catch (err) {
        console.error("Failed to load recommendations", err);
      }
    };

    const fetchShelves = async () => {
      try {
        const res = await api.get("/library");
        setShelves(res.data);
      } catch (err) {
        console.error("Failed to load library", err);
      }
    };

    fetchBook();
    fetchReviews();
    fetchRecommendations();
    fetchShelves();
  }, [id]);

  // Submit new review
  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment || newReview.rating === 0) return;

    setSubmitting(true);
    try {
      const payload = {
        bookId: id,
        comment: newReview.comment,
        rating: newReview.rating,
      };
      await api.post("/reviews", payload);

      setReviews((prev) => [
        ...prev,
        {
          ...payload,
          _id: uuidv4(),
          user: { name: "You", image: null, email: null },
          createdAt: new Date().toISOString(),
        },
      ]);

      setNewReview({ rating: 0, comment: "" });
      setShowReviewForm(false);
    } catch (err) {
      console.error("Failed to submit review", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Add book to shelf
  const addToShelf = async (type) => {
    if (!type || !book) return;
    setShelf(type);

    try {
      let entry;
      if (type === "reading") {
        entry = {
          bookId: id,
          title: book.title,
          cover: book.cover,
          pagesRead: progress.pagesRead || 0,
          totalPages: progress.totalPages || 0,
        };
      } else {
        entry = {
          bookId: id,
          title: book.title,
          cover: book.cover,
        };
      }

      await api.post("/users/shelves", {
        bookId: id,
        shelf: type,
        progress: type === "reading" ? progress : undefined,
        bookInfo: entry,
      });

      // Update local shelves state immediately
      setShelves((prev) => ({
        ...prev,
        [type]: [...prev[type], entry],
      }));

      alert(
        `Book added to "${
          type === "want"
            ? "Want to Read"
            : type === "reading"
            ? "Currently Reading"
            : "Read"
        }"`
      );
    } catch (err) {
      console.error("Failed to add to shelf", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center italic font-serif">
        Retrieving...
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex items-center justify-center font-serif italic text-2xl">
        Volume Missing.
      </div>
    );

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-20 px-6">
      <div className="max-w-5xl mx-auto my-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Return to Archive
            </span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => addToShelf("want")}
              className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-colors"
            >
              <BookmarkPlus size={16} />
              Want to Read
            </button>
            <button
              onClick={() => addToShelf("reading")}
              className="flex items-center gap-2 bg-emerald-800 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-stone-900 transition-colors"
            >
              Currently Reading
            </button>
            <button
              onClick={() => addToShelf("read")}
              className="flex items-center gap-2 bg-stone-700 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-colors"
            >
              Read
            </button>
          </div>
        </div>

        {/* Book Info */}
        <main className="relative bg-white border-[6px] border-stone-900 p-8 md:p-16 mb-12">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-stone-100 pb-10 mb-12 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-800 mb-2">
                <Bookmark size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  Official Catalogued Entry
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 italic tracking-tight leading-none">
                {book.title}
              </h1>
            </div>
            <div className="flex flex-col items-end border-l-4 border-stone-900 pl-6 py-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Accession No.
              </span>
              <span className="font-mono text-lg text-stone-900 uppercase">
                #{id.slice(-6)}
              </span>
            </div>
          </header>

          <div className="grid md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <div className="bg-stone-100 border-2 border-stone-900 p-3 transform -rotate-1">
                <div className="relative aspect-[3/4] bg-stone-200 overflow-hidden grayscale">
                  {book.cover && (
                    <Image
                      fill
                      src={book.cover}
                      alt={book.title}
                      className="object-cover"
                    />
                  )}
                </div>
              </div>
              <p className="mt-4 text-[10px] font-serif italic text-stone-400 text-center uppercase tracking-widest">
                Fig. 1.0: Primary Visualization
              </p>
            </div>

            <div className="md:col-span-8 space-y-10">
              <div className="grid grid-cols-2 gap-8 border-b-2 border-stone-100 pb-10">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">
                    Primary Scribe
                  </label>
                  <p className="font-serif text-xl font-bold text-stone-900 italic">
                    {book.author}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 block">
                    Classification
                  </label>
                  <span className="inline-block px-3 py-1 bg-stone-900 text-stone-100 text-[10px] font-bold uppercase tracking-widest rounded-sm">
                    {book.genre}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <History size={16} className="text-stone-900" />
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900">
                    Manuscript Abstract
                  </h3>
                </div>
                <p className="font-serif text-lg text-stone-700 leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:mr-1 first-letter:float-left first-letter:text-stone-900">
                  {book.description}
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Recommendations */}
        {recommended.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-serif font-bold text-stone-900 italic mb-4">
              Recommended For You
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recommended.map((rec) => (
                <div
                  key={rec._id}
                  className="bg-white border-2 border-stone-900 p-4"
                >
                  <Image
                    src={rec.cover}
                    width={150}
                    height={220}
                    alt={rec.title}
                    className="object-cover"
                  />
                  <h3 className="font-serif font-bold italic mt-2">
                    {rec.title}
                  </h3>
                  <p className="text-[10px] text-stone-500">{rec.author}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* My Shelves Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-serif font-bold text-stone-900 italic mb-4">
            My Shelves
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["want", "reading", "read"].map((type) => (
              <div
                key={type}
                className="bg-white border-2 border-stone-900 p-4"
              >
                <h3 className="text-xl font-serif font-bold mb-4 capitalize">
                  {type === "want"
                    ? "Want to Read"
                    : type === "reading"
                    ? "Currently Reading"
                    : "Read"}
                </h3>
                {shelves[type].length === 0 ? (
                  <p className="text-stone-400 italic text-sm">
                    No books in this shelf yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {shelves[type].map((b) => (
                      <div
                        key={b.bookId}
                        className="flex items-center gap-3 border-b border-stone-200 pb-2"
                      >
                        {b.cover && (
                          <Image
                            src={b.cover}
                            width={50}
                            height={70}
                            alt={b.title}
                            className="object-cover"
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="font-serif font-bold italic text-stone-900">
                            {b.title}
                          </span>
                          {type === "reading" && (
                            <span className="text-[10px] text-stone-500">
                              {b.pagesRead}/{b.totalPages} pages read
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section className="mt-20 border-t-4 border-stone-200 pt-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="text-stone-400" size={18} />
                <h2 className="text-4xl font-serif font-bold text-stone-900 italic">
                  Public Discourse
                </h2>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">
                Archived Reader Commendations
              </p>
            </div>

            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-stone-900 text-stone-100 px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-800 transition-all"
            >
              Submit Field Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="bg-white border-2 border-stone-900 p-8 relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    {rev.user.image && (
                      <Image
                        src={rev.user.image}
                        width={32}
                        height={32}
                        alt={rev.user.name || "Anonymous"}
                        className="rounded-full"
                      />
                    )}
                    <p className="font-serif font-bold italic text-stone-900">
                      {rev.user.name || "Anonymous"}
                    </p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < rev.rating ? "#064e3b" : "none"}
                        className={
                          i < rev.rating ? "text-emerald-900" : "text-stone-200"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="font-serif text-stone-700 leading-relaxed mb-6 italic">
                  "{rev.comment}"
                </p>
                <p className="text-[9px] font-mono text-stone-400 uppercase tracking-tighter text-right border-t border-stone-100 pt-4">
                  Stamped: {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Review Form */}
        {showReviewForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setShowReviewForm(false)}
            />
            <div className="relative w-full max-w-xl bg-[#fdfbf7] border-[6px] border-stone-900 p-10 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-900"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-serif font-bold text-stone-900 italic mb-2">
                Witness Statement
              </h2>
              <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 mb-6">
                Formal Critique Entry
              </p>

              <form className="space-y-6" onSubmit={submitReview}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                    Evaluation Grade
                  </label>
                  <div className="flex gap-4 bg-white border-2 border-stone-200 p-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          setNewReview((prev) => ({ ...prev, rating: num }))
                        }
                        className={`transition-colors ${
                          num <= newReview.rating
                            ? "text-emerald-800"
                            : "text-stone-300"
                        }`}
                      >
                        <Star size={24} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">
                    Statement Content
                  </label>
                  <textarea
                    rows={5}
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    className="w-full bg-white border-2 border-stone-200 p-4 font-serif text-stone-900 focus:outline-none focus:border-stone-900 transition-colors resize-none"
                    placeholder="Provide your historical or literary assessment..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-stone-900 text-white py-5 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-800 transition-colors"
                >
                  <Send size={16} />
                  {submitting ? "Transmitting..." : "Transmit to Archive"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
