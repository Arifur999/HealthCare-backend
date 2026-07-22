import status from "http-status";
import { prisma } from "../../lib/prisma.js";
import AppError from "../../errorHelpers/AppError.js";

interface NewsPayload {
    title: string;
    slug?: string;
    excerpt: string;
    content: string[];
    coverImage?: string;
    author?: string;
    category?: string;
    isPublished?: boolean;
}

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80);

// Public: only published articles, newest first.
const getPublishedNews = async () => {
    return await prisma.news.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: "desc" },
    });
};

const getNewsBySlug = async (slug: string) => {
    const article = await prisma.news.findFirst({
        where: { slug, isPublished: true },
    });
    if (!article) {
        throw new AppError(status.NOT_FOUND, "Article not found");
    }
    return article;
};

// Admin: everything, including unpublished drafts.
const getAllNews = async () => {
    return await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
};

const createNews = async (payload: NewsPayload) => {
    const baseSlug = payload.slug ? slugify(payload.slug) : slugify(payload.title);

    // Ensure slug uniqueness by appending a counter if needed.
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.news.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter++}`;
    }

    return await prisma.news.create({
        data: {
            title: payload.title,
            slug,
            excerpt: payload.excerpt,
            content: payload.content,
            coverImage: payload.coverImage,
            author: payload.author,
            category: payload.category,
            isPublished: payload.isPublished ?? true,
        },
    });
};

const updateNews = async (id: string, payload: Partial<NewsPayload>) => {
    await prisma.news.findUniqueOrThrow({ where: { id } });
    return await prisma.news.update({
        where: { id },
        data: {
            title: payload.title,
            excerpt: payload.excerpt,
            content: payload.content,
            coverImage: payload.coverImage,
            author: payload.author,
            category: payload.category,
            isPublished: payload.isPublished,
        },
    });
};

const deleteNews = async (id: string) => {
    await prisma.news.findUniqueOrThrow({ where: { id } });
    await prisma.news.delete({ where: { id } });
    return { message: "Article deleted" };
};

export const NewsService = {
    getPublishedNews,
    getNewsBySlug,
    getAllNews,
    createNews,
    updateNews,
    deleteNews,
};
