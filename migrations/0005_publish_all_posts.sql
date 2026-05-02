-- Publish all existing blog posts that are still in draft status.
-- Admin workflow: "Publish" button = public immediately, no draft queue needed.
UPDATE blog_posts
SET
  status = 'published',
  published_at = COALESCE(published_at, updated_at)
WHERE status = 'draft';
