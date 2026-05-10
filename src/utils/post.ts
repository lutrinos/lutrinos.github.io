import { type CollectionEntry, getCollection } from "astro:content";

import { CATEGORY_SEPARATOR, type CategoryPath, getCategoryPathParts } from "@utils/category";
import { parseTags, type Tag } from "@utils/tag";
import { getCategoryUrl } from "@utils/url";


// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
    const allBlogPosts = await getCollection("posts", ({ data }) => {
        return data.draft !== true;
    });

    const sorted = allBlogPosts.sort((a, b) => {
        // Sort by pinned status first, pinned posts come first
        if (a.data.pinned && !b.data.pinned) return -1;
        if (!a.data.pinned && b.data.pinned) return 1;

        // If pinned status is the same, sort by publication date
        const dateA = new Date(a.data.published);
        const dateB = new Date(b.data.published);
        return dateA > dateB ? -1 : 1;
    });

    // We create the slug if it doesn't exists
    return sorted.map((p) => {
        p.data.slug = p.data.slug || p.id;
        return p;
    });
}

export async function getSortedPosts() {
    const sorted = await getRawSortedPosts();

    for (let i = 1; i < sorted.length; i++) {
        sorted[i].data.nextSlug = sorted[i - 1].data.slug;
        sorted[i].data.nextTitle = sorted[i - 1].data.title;
    }
    for (let i = 0; i < sorted.length - 1; i++) {
        sorted[i].data.prevSlug = sorted[i + 1].data.slug;
        sorted[i].data.prevTitle = sorted[i + 1].data.title;
    }

    return sorted;
}
export type PostForList = {
    id: string;
    data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
    const sortedFullPosts = await getRawSortedPosts();

    // delete post.body
    const sortedPostsList = sortedFullPosts.map((post) => ({
        id: post.data.slug,
        data: post.data,
    }));

    return sortedPostsList;
}
export async function getTagList(locale: string): Promise<Tag[]> {
    const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
        return data.draft !== true && data.locale === locale;
    });

    const countMap: { [key: string]: number } = {};
    allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
        const tags = parseTags(post.data.tags);
        tags.forEach((tag: string) => {
            if (!countMap[tag]) countMap[tag] = 0;
            countMap[tag]++;
        });
    });

    // sort tags
    const keys: string[] = Object.keys(countMap).sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
    name: string;
    count: number;
    url: string;
};

export type CategoryTreeItem = {
    name: string;
    count: number;
    url: string;
    path: CategoryPath;
    children: CategoryTreeItem[];
};

export async function getCategoryList(locale: string): Promise<Category[]> {
    const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
        return data.draft !== true && data.locale === locale;
    });
    const count: { [key: string]: number } = {};
    allBlogPosts.forEach((post: { data: { category: string | string[] | null } }) => {
        const categoryParts = getCategoryPathParts(post.data.category);

        if (!categoryParts) {
            return;
        }

        const categoryName = categoryParts.join(CATEGORY_SEPARATOR);
        count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
    });

    const lst = Object.keys(count).sort((a, b) => {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    const ret: Category[] = [];
    for (const c of lst) {
        ret.push({
            name: c,
            count: count[c],
            url: getCategoryUrl(locale, c),
        });
    }
    return ret;
}

export async function getCategoryTree(locale: string): Promise<CategoryTreeItem[]> {
    const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
        return data.draft !== true && data.locale === locale;
    });

    type CategoryTreeInternal = {
        name: string;
        count: number;
        path: CategoryPath;
        children: Map<string, CategoryTreeInternal>;
    };

    const root = new Map<string, CategoryTreeInternal>();

    for (const post of allBlogPosts) {
        const rawParts = getCategoryPathParts(post.data.category);
        const categoryParts = rawParts && rawParts.length > 0 ? rawParts : [];
        let currentLevel = root;
        let currentPath: string[] = [];

        for (const rawName of categoryParts) {
            const name = rawName.trim();
            if (!name) continue;
            currentPath = [...currentPath, name];
            let node = currentLevel.get(name);
            if (!node) {
                node = {
                    name,
                    count: 0,
                    path: currentPath,
                    children: new Map<string, CategoryTreeInternal>(),
                };
                currentLevel.set(name, node);
            }
            node.count += 1;
            currentLevel = node.children;
        }
    }

    const buildTree = (level: Map<string, CategoryTreeInternal>): CategoryTreeItem[] => {
        const sorted = Array.from(level.values()).sort((a, b) =>
            a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
        );
        return sorted.map((node) => ({
            name: node.name,
            count: node.count,
            path: node.path,
            url: getCategoryUrl(locale, node.path),
            children: buildTree(node.children),
        }));
    };

    return buildTree(root);
}