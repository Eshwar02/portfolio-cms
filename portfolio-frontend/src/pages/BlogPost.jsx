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
    <div className="min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Navbar />
      <article className="mx-auto max-w-3xl px-4 py-16">
        <Link to="/" className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          ← Back
        </Link>
        {notFound ? (
          <p className="mt-8 text-neutral-500">Post not found.</p>
        ) : post ? (
          <>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{post.title}</h1>
            {post.published_at && (
              <p className="mt-1 text-sm text-neutral-400">
                {new Date(post.published_at).toLocaleDateString()}
              </p>
            )}
            {mediaUrl(post.cover_image) && (
              <img
                src={mediaUrl(post.cover_image)}
                alt={post.title}
                className="mt-6 w-full rounded-lg border hairline object-cover"
              />
            )}
            <div className="mt-6 whitespace-pre-wrap leading-relaxed text-neutral-700 dark:text-neutral-300">
              {post.body}
            </div>
          </>
        ) : (
          <p className="mt-8 text-neutral-400">Loading…</p>
        )}
      </article>
    </div>
  );
}
