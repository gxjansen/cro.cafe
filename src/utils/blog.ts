import type { PaginateFunction } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Post } from '~/types';
import { APP_BLOG } from 'astrowind:config';
import { trimSlash } from './permalinks';

type BlogEntry = CollectionEntry<'post'>;

const generatePermalink = async ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate: Date;
  category: string | undefined;
}) => {
  const year = String(publishDate.getFullYear()).padStart(4, '0');
  const month = String(publishDate.getMonth() + 1).padStart(2, '0');
  const day = String(publishDate.getDate()).padStart(2, '0');
  const hour = String(publishDate.getHours()).padStart(2, '0');
  const minute = String(publishDate.getMinutes()).padStart(2, '0');
  const second = String(publishDate.getSeconds()).padStart(2, '0');

  const permalink = `blog/%slug%`
    .replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category || '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  return permalink
    .split('/')
    .map((el: string) => trimSlash(el))
    .filter((el: string) => !!el)
    .join('/');
};

const getNormalizedPost = async (post: BlogEntry): Promise<Post> => {
  if (!post || !post.data) {
    throw new Error('Invalid post data');
  }

  const { id, data } = post;
  const rendered = await post.render();
  const { Content, remarkPluginFrontmatter } = rendered;

  const {
    publishDate: rawPublishDate = new Date(),
    title,
    excerpt,
    image,
    tags: rawTags = [],
    category: rawCategory,
    author,
    draft = false,
  } = data;

  const slug = id.split('/').pop() || id;
  const publishDate = new Date(rawPublishDate);

  const category = rawCategory
    ? {
        slug: rawCategory.toLowerCase().replace(/\s+/g, '-'),
        title: rawCategory,
      }
    : undefined;

  const tags = rawTags.map((tag: string) => ({
    slug: tag.toLowerCase().replace(/\s+/g, '-'),
    title: tag,
  }));

  return {
    id: id,
    slug: slug,
    permalink: await generatePermalink({ id, slug, publishDate, category: category?.slug }),
    publishDate: publishDate,
    title: title,
    description: excerpt || '',
    body: '',
    image: image,
    category: category,
    tags: tags,
    author: author,
    draft: draft,
    excerpt: excerpt,
    readingTime: remarkPluginFrontmatter?.readingTime,
    Content: Content,
  };
};

const load = async function (): Promise<Array<Post>> {
  const posts = await getCollection('post', {
    type: 'content',
    filter: (entry: BlogEntry) => import.meta.env.DEV || !entry.data.draft,
  });
  const normalizedPosts = await Promise.all(posts.map(getNormalizedPost));

  return normalizedPosts.sort(
    (a: Post, b: Post) => b.publishDate.valueOf() - a.publishDate.valueOf()
  );
};

let _posts: Array<Post>;

/** */
export const isBlogEnabled = APP_BLOG.enabled;
export const isRelatedPostsEnabled = APP_BLOG.isRelatedPostsEnabled;
export const isBlogListRouteEnabled = APP_BLOG.list.isEnabled;
export const isBlogPostRouteEnabled = APP_BLOG.post.isEnabled;
export const isBlogCategoryRouteEnabled = APP_BLOG.category.isEnabled;
export const isBlogTagRouteEnabled = APP_BLOG.tag.isEnabled;

export const blogListRobots = APP_BLOG.list.robots;
export const blogPostRobots = APP_BLOG.post.robots;
export const blogCategoryRobots = APP_BLOG.category.robots;
export const blogTagRobots = APP_BLOG.tag.robots;

export const blogPostsPerPage = APP_BLOG?.postsPerPage;

/** */
export const fetchPosts = async (): Promise<Array<Post>> => {
  if (!_posts) {
    _posts = await load();
  }

  return _posts;
};

/** */
export const findPostsBySlugs = async (slugs: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(slugs)) return [];

  const posts = await fetchPosts();

  return slugs.reduce(function (r: Array<Post>, slug: string) {
    posts.some(function (post: Post) {
      return slug === post.slug && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findPostsByIds = async (ids: Array<string>): Promise<Array<Post>> => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return ids.reduce(function (r: Array<Post>, id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};

/** */
export const findLatestPosts = async ({ count }: { count?: number }): Promise<Array<Post>> => {
  const _count = count || 4;
  const posts = await fetchPosts();

  return posts ? posts.slice(0, _count) : [];
};

/** */
export const getStaticPathsBlogList = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogListRouteEnabled) return [];
  return paginate(await fetchPosts(), {
    params: { blog: 'blog' },
    pageSize: blogPostsPerPage,
  });
};

/** */
export const getStaticPathsBlogPost = async () => {
  if (!isBlogEnabled || !isBlogPostRouteEnabled) return [];
  return (await fetchPosts()).flatMap((post: Post) => ({
    params: {
      blog: post.permalink,
    },
    props: { post },
  }));
};

/** */
export const getStaticPathsBlogCategory = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogCategoryRouteEnabled) return [];

  const posts = await fetchPosts();
  const categories: Record<string, { slug: string; title: string }> = {};
  posts.forEach((post: Post) => {
    if (post.category?.slug) {
      categories[post.category.slug] = post.category;
    }
  });

  return Array.from(Object.keys(categories)).flatMap((categorySlug: string) =>
    paginate(
      posts.filter((post: Post) => post.category?.slug && categorySlug === post.category.slug),
      {
        params: { category: categorySlug, blog: 'category' },
        pageSize: blogPostsPerPage,
        props: { category: categories[categorySlug] },
      }
    )
  );
};

/** */
export const getStaticPathsBlogTag = async ({ paginate }: { paginate: PaginateFunction }) => {
  if (!isBlogEnabled || !isBlogTagRouteEnabled) return [];

  const posts = await fetchPosts();
  const tags: Record<string, { slug: string; title: string }> = {};
  posts.forEach((post: Post) => {
    if (Array.isArray(post.tags)) {
      post.tags.forEach((tag: { slug: string; title: string }) => {
        if (tag?.slug) {
          tags[tag.slug] = tag;
        }
      });
    }
  });

  return Array.from(Object.keys(tags)).flatMap((tagSlug: string) =>
    paginate(
      posts.filter(
        (post: Post) =>
          Array.isArray(post.tags) &&
          post.tags.find((elem: { slug: string }) => elem.slug === tagSlug)
      ),
      {
        params: { tag: tagSlug, blog: 'tag' },
        pageSize: blogPostsPerPage,
        props: { tag: tags[tagSlug] },
      }
    )
  );
};

/** */
export async function getRelatedPosts(originalPost: Post, maxResults: number = 4): Promise<Post[]> {
  const allPosts = await fetchPosts();
  const originalTagsSet = new Set(
    originalPost.tags ? originalPost.tags.map((tag: { slug: string }) => tag.slug) : []
  );

  const postsWithScores = allPosts.reduce(
    (acc: { post: Post; score: number }[], iteratedPost: Post) => {
      if (iteratedPost.slug === originalPost.slug) return acc;

      let score = 0;
      if (
        iteratedPost.category &&
        originalPost.category &&
        iteratedPost.category.slug === originalPost.category.slug
      ) {
        score += 5;
      }

      if (iteratedPost.tags) {
        iteratedPost.tags.forEach((tag: { slug: string }) => {
          if (originalTagsSet.has(tag.slug)) {
            score += 1;
          }
        });
      }

      acc.push({ post: iteratedPost, score });
      return acc;
    },
    []
  );

  postsWithScores.sort((a: { score: number }, b: { score: number }) => b.score - a.score);

  const selectedPosts: Post[] = [];
  postsWithScores.slice(0, maxResults).forEach(({ post }: { post: Post }) => {
    selectedPosts.push(post);
  });

  return selectedPosts;
}
