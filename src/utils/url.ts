import type { CollectionEntry } from "astro:content";

import { CATEGORY_SEPARATOR } from "@utils/category";

export function pathsEqual(path1: string, path2: string) {
    const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
    const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
    return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
    const joined = parts.join("/");
    return joined.replace(/\/+/g, "/");
}

export function removeFileExtension(id: string): string {
    return id.replace(/\.(md|mdx|markdown)$/i, "");
}

export function getPostUrlBySlug(slug: string): string {
    // Remove file extension (e.g., .md, .mdx etc.)
    const slugWithoutExt = removeFileExtension(slug);
    return url(`/posts/${slugWithoutExt}/`);
}

export function getPostUrlByRouteName(routeName: string): string {
    // Remove leading slash and ensure permalinks are under the /posts/ path
    const cleanRouteName = routeName.replace(/^\/+/, "");
    return url(`/posts/${cleanRouteName}/`);
}

export function getPostUrl(post: CollectionEntry<"posts">): string;
export function getPostUrl(post: { id: string; data: { routeName?: string } }): string;
export function getPostUrl(post: any): string {
    // Otherwise use the default slug path
    return getLocaleUrl(post.data.locale, 'posts', post.data.slug);
}

export function getCategoryUrl(locale: string, category: string | string[] | null): string {
    if (!category) return getLocaleUrl(locale, "/archive/?uncategorized=true");
    const parts = Array.isArray(category)
        ? category.map((item) => String(item).trim()).filter((item) => item.length > 0)
        : [category.trim()];
    const label = parts.join(CATEGORY_SEPARATOR).trim();
    if (!label || label.toLowerCase() === 'uncategorized') {
        return getLocaleUrl(locale, "/archive/?uncategorized=true");
    }
    return getLocaleUrl(locale, `/archive/?category=${encodeURIComponent(label)}`);
}

export function getTagUrl(tag: string): string {
    if (!tag) return url("/archive/");
    return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

export function getDir(path: string): string {
    // Remove file extension
    const pathWithoutExt = removeFileExtension(path);
    const lastSlashIndex = pathWithoutExt.lastIndexOf("/");
    if (lastSlashIndex < 0) {
        return "/";
    }
    return pathWithoutExt.substring(0, lastSlashIndex + 1);
}

export function getFileDirFromPath(filePath: string): string {
    return filePath.replace(/^src\//, "").replace(/\/[^/]+$/, "");
}

export function getLocaleUrl(locale: string, ...path: string[]) {
    if (locale && locale !== "fr") {
        return joinUrl("", import.meta.env.BASE_URL, locale, ...path);
    }

    return url(...path);
}

export function url(...path: string[]) {
    return joinUrl("", import.meta.env.BASE_URL, ...path);
}