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

// @ts-ignore
import config from "../site.config.yml";

// Type of config
type ConfigFile = {
    site: SiteConfig;
    analytics: AnalyticsConfig;
    navbar: {
        links: Array<NavbarLink | string>;
    };
    sidebar: SidebarConfig;
    profile: ProfileConfig;
    announcement: AnnouncementConfig;
    post: PostConfig;
    footer: FooterConfig;
};

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
