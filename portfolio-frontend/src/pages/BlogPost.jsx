import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { mediaUrl } from "../lib/api";
import Navbar from "../components/Navbar";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/blogs/${slug}/`)
      .then((r) => setPost(r.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 py-16">
        <Link to="/" className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)]">
          ← Back
        </Link>
        {notFound ? (
          <p className="mt-8 text-[var(--muted)]">Post not found.</p>
        ) : post ? (
          <div className="animate-rise">
            <h1 className="display mt-4 text-4xl font-semibold">{post.title}</h1>
            {post.published_at && (
              <p className="mt-2 text-sm text-[var(--muted)]">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            )}
            {mediaUrl(post.cover_image) && (
              <img
                src={mediaUrl(post.cover_image)}
                alt={post.title}
                className="mt-6 w-full rounded-xl border hairline object-cover"
              />
            )}
            <div className="mt-8 whitespace-pre-wrap text-lg leading-relaxed text-[var(--muted)]">
              {post.body}
            </div>
          </div>
        ) : (
          <p className="mt-8 text-[var(--muted)]">Loading…</p>
        )}
      </article>
    </div>
  );
}
