import type {
    SiteConfig,
    AnalyticsConfig,
    NavbarLink,
    NavbarConfig,
    SidebarConfig,
    ProfileConfig,
    AnnouncementConfig,
    PostConfig,
    FooterConfig
} from "./types/config";
import { LinkPreset } from "./types/config";

// @ts-ignore
import config from "../site.config.yml";

// Type of config
type ConfigFile = {
    site: SiteConfig;
    analytics: AnalyticsConfig;
    navbar: {
        links: Array<NavbarLink | LinkPreset | string>;
    };
    sidebar: SidebarConfig;
    profile: ProfileConfig;
    announcement: AnnouncementConfig;
    post: PostConfig;
    footer: FooterConfig;
};

const linkPresetNameMap: Record<string, LinkPreset> = {
    Home: LinkPreset.Home,
    Archive: LinkPreset.Archive,
    Projects: LinkPreset.Projects,
    Skills: LinkPreset.Skills,
    Timeline: LinkPreset.Timeline,
    Diary: LinkPreset.Diary,
    Albums: LinkPreset.Albums,
    Anime: LinkPreset.Anime,
    About: LinkPreset.About,
    Friends: LinkPreset.Friends,
};

const normalizeNavbarLink = (
    link: NavbarLink | LinkPreset | string,
): NavbarLink | LinkPreset => {
    if (typeof link === "string") {
        const preset = linkPresetNameMap[link];
        if (preset === undefined) {
            throw new Error(`Unknown LinkPreset: ${link}`);
        }
        return preset;
    }
    if (typeof link === "number") {
        return link;
    }
    const children = link.children?.map(normalizeNavbarLink);
    return children ? { ...link, children } : link;
};

const normalizeNavbarLinks = (links: Array<NavbarLink | LinkPreset | string>) =>
    links.map(normalizeNavbarLink);

const resolvedPostConfig: PostConfig = {
    ...config.post
};

// Site configuration
export const siteConfig: SiteConfig = config.site;

// Analytics configuration
export const analyticsConfig: AnalyticsConfig = {
    enabled: config.analytics.enabled,
    platform: config.analytics.platform,
    umami: {
        apiKey: config.analytics.umami.apiKey ?? import.meta.env.UMAMI_API_KEY,
        baseUrl: config.analytics.umami.baseUrl,
        code: config.analytics.umami.code ?? import.meta.env.UMAMI_TRACKING_CODE,
    }
};

// Navbar configuration
export const navbarConfig: NavbarConfig = {
    links: normalizeNavbarLinks(config.navbar.links),
};

// Sidebar configuration
export const sidebarConfig: SidebarConfig = config.sidebar;

// Profile configuration
export const profileConfig: ProfileConfig = config.profile;

// Announcement configuration
export const announcementConfig: AnnouncementConfig = config.announcement;

// Post configuration
export const postConfig: PostConfig = resolvedPostConfig;

// Footer configuration
export const footerConfig: FooterConfig = config.footer;
