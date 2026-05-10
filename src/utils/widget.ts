import type {
    WidgetComponentConfig,
    WidgetComponentType,
    SidebarConfig,
} from "@/types/config";
import { sidebarConfig } from "@/config";


/**
 * Component map - maps component types to actual component paths
 */
export const WIDGET_COMPONENT_MAP = {
    profile: "@components/sidebar/profile.astro",
    announcement: "@components/sidebar/announcement.astro",
    directory: "@components/sidebar/directory.astro",
    categories: "@components/sidebar/categories.astro",
    tags: "@components/sidebar/tags.astro",
    toc: "@components/sidebar/toc.astro",
    statistics: "@components/sidebar/statistics.astro",
    custom: null, // Custom components need a path specified in the config
} as const;

/**
 * Component manager class
 * Responsible for managing dynamic loading, sorting, and rendering of sidebar components
 */
export class WidgetManager {
    private config: SidebarConfig;

    constructor(config: SidebarConfig = sidebarConfig) {
        this.config = config;
    }

    /**
     * Get configuration
     */
    getConfig(): SidebarConfig {
        return this.config;
    }

    /**
     * Check if the component is visible on the current page and device
     * @param component Component configuration
     * @param currentPath Current page path
     * @param deviceType Device type: 'mobile' | 'tablet' | 'desktop'
     */
    isVisible(component: WidgetComponentConfig, currentPath?: string, deviceType?: 'mobile' | 'tablet' | 'desktop'): boolean {
        // Check responsive hidden configuration
        if (deviceType && component.responsive?.hidden?.includes(deviceType)) {
            return false;
        }
        // Check page path visibility
        return this.shouldShowComponent(component, currentPath);
    }

    /**
     * Check if the component is visible on the current page
     * @param component Component configuration
     * @param currentPath Current page path
     */
    shouldShowComponent(component: WidgetComponentConfig, currentPath?: string): boolean {
        if (!component.visibility || !currentPath) {
            return true;
        }
        const { mode, paths } = component.visibility;
        // Ensure path starts with / for matching
        let normalizedPath = currentPath.startsWith('/') ? currentPath : '/' + currentPath;
        // Remove trailing slash (preserve if it's root /)
        if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
            normalizedPath = normalizedPath.slice(0, -1);
        }
        
        const matches = paths.some((pattern) => {
            try {
                return new RegExp(pattern).test(normalizedPath);
            } catch (e) {
                console.warn(`Invalid regex pattern in component visibility config: ${pattern}`, e);
                return false;
            }
        });

        if (mode === "include") {
            return matches;
        }
        if (mode === "exclude") {
            return !matches;
        }
        return true;
    }

    /**
     * Get component list on specified sidebar
     * @param side Sidebar position: 'left' | 'right'
     * @param currentPath Current page path (optional, for filtering)
     */
    getComponentsBySide(side: "left" | "right", currentPath?: string): WidgetComponentConfig[] {
        const components = this.config.components[side] || [];
        if (currentPath) {
            return components.filter(c => this.shouldShowComponent(c, currentPath));
        }
        return components;
    }

    /**
     * Get component list based on position
     * @param position Component position: 'top' | 'sticky'
     * @param currentPath Current page path (optional, for filtering)
     */
    getComponentsByPosition(position: "top" | "sticky", currentPath?: string): WidgetComponentConfig[] {
        const left = this.getComponentsBySideAndPosition("left", position, currentPath);
        const right = this.getComponentsBySideAndPosition("right", position, currentPath);
        // Note: This might return duplicates if left/right logic overlaps, but used for enabled types check
        return [...left, ...right];
    }

    /**
     * Get component list based on sidebar and position
     * @param side Sidebar position: 'left' | 'right' | 'middle'
     * @param position Component position: 'top' | 'sticky'
     * @param currentPath Current page path (optional, for filtering)
     */
    getComponentsBySideAndPosition(
        side: "left" | "right" | "middle",
        position: "top" | "sticky",
        currentPath?: string,
    ): WidgetComponentConfig[] {
        const leftComponents = (this.config.components.left || [])
            .filter(c => c.position === position)
            .filter(c => this.shouldShowComponent(c, currentPath));
        const rightComponents = (this.config.components.right || [])
            .filter(c => c.position === position)
            .filter(c => this.shouldShowComponent(c, currentPath));

        if (side === "left") {
            // Left sidebar includes Right components on Tablet (merged)
            return [...leftComponents, ...rightComponents];
        }
        
        if (side === "right") {
            // Right sidebar only shows Right components (Desktop only)
            return rightComponents;
        }

        if (side === "middle") {
            // Middle sidebar includes all components
            return [...leftComponents, ...rightComponents];
        }

        return [];
    }

    /**
     * Get CSS class name of the component
     * @param component Component configuration
     * @param index Index of the component in the list
     * @param side Currently rendered sidebar position
     */
    getComponentClass(component: WidgetComponentConfig, index: number, side: "left" | "right" | "middle"): string {
        const classes: string[] = [];

        // Basic responsive hidden configuration (user-configured)
        if (component.responsive?.hidden) {
            component.responsive.hidden.forEach((device) => {
                switch (device) {
                    case "mobile":
                        classes.push("hidden md:block");
                        break;
                    case "tablet":
                        classes.push("md:hidden lg:block");
                        break;
                    case "desktop":
                        classes.push("lg:hidden");
                        break;
                }
            });
        }

        // Automatic layout logic
        const isFromLeft = (this.config.components.left || []).includes(component);
        const isFromRight = (this.config.components.right || []).includes(component);

        if (side === "left") {
            if (isFromRight && !isFromLeft) {
                // If a right component is rendered in the left sidebar (tablet mode), only display on tablet
                classes.push("hidden md:block lg:hidden");
            }
            // Left components display by default
        }

        return classes.join(" ");
    }

    /**
     * Get inline style of the component
     * @param component Component configuration
     * @param index Index of the component in the list
     */
    getComponentStyle(component: WidgetComponentConfig, index: number): string {
        const styles: string[] = [];

        // Add custom styles
        if (component.style) {
            styles.push(component.style);
        }

        return styles.join("; ");
    }

    /**
     * Check if the component should collapse
     * @param component Component configuration
     * @param itemCount Number of content items in the component
     */
    isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
        if (!component.responsive?.collapseThreshold) {
            return false;
        }
        return itemCount >= component.responsive.collapseThreshold;
    }

    /**
     * Get path of the component
     * @param componentType Component type
     */
    getComponentPath(componentType: WidgetComponentType): string | null {
        return WIDGET_COMPONENT_MAP[componentType];
    }

    /**
     * Check if the specified sidebar has actual displayable content
     * @param side Sidebar position: 'left' | 'right'
     * @param headings Page heading list, used to determine if special components are displayed
     * @param currentPath Current page path (optional, for filtering)
     */
    hasContentOnSide(side: "left" | "right", headings: any[] = [], currentPath?: string): boolean {
        const components = this.getComponentsBySide(side, currentPath);
        if (components.length === 0) return false;

        // As long as one component can display content, the sidebar is not empty
        return components.some((component) => {
            // TOC component only displays when there are headings
            if (component.type === "toc") {
                return headings && headings.length > 0;
            }
            // Other components are currently assumed to always have content
            return true;
        });
    }

    /**
     * Update component configuration
     * @param newConfig New configuration
     */
    updateConfig(newConfig: Partial<SidebarConfig>): void {
        this.config = { ...this.config, ...newConfig };
    }

    /**
     * Add new component
     * @param component Component configuration
     * @param side Sidebar position
     */
    addComponent(component: WidgetComponentConfig, side: "left" | "right"): void {
        if (!this.config.components[side]) {
            this.config.components[side] = [];
        }
        this.config.components[side].push(component);
    }

    /**
     * Remove component
     * @param componentType Component type
     */
    removeComponent(componentType: WidgetComponentType): void {
        if (this.config.components.left) {
            this.config.components.left = this.config.components.left.filter(
                (component) => component.type !== componentType,
            );
        }
        if (this.config.components.right) {
            this.config.components.right = this.config.components.right.filter(
                (component) => component.type !== componentType,
            );
        }
    }

    /**
     * Reorder component
     * @param side Sidebar
     * @param oldIndex Old index
     * @param newIndex New index
     */
    reorderComponent(side: "left" | "right", oldIndex: number, newIndex: number): void {
        const list = this.config.components[side];
        if (!list) return;
        
        if (oldIndex >= 0 && oldIndex < list.length && newIndex >= 0 && newIndex < list.length) {
            const [moved] = list.splice(oldIndex, 1);
            list.splice(newIndex, 0, moved);
        }
    }

    /**
     * Check if the component should be rendered in the sidebar
     * @param componentType Component type
     */
    isSidebarComponent(componentType: WidgetComponentType): boolean {
        return true;
    }

    /**
     * Get list of headings in the page
     * @returns Formatted heading array
     */
    getPageHeadings() {
        if (typeof document === "undefined") return [];
        return Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"))
            .filter((h) => h.id)
            .map((h) => ({
                depth: parseInt(h.tagName.substring(1)),
                slug: h.id,
                text: (h.textContent || "").replace(/#+\s*$/, ""),
            }));
    }

    /**
     * Get grid layout related class names
     * @param headings Page heading list
     * @param currentPath Current page path (optional, for filtering)
     */
    getGridLayout(headings: any[] = [], currentPath?: string) {
        const hasLeftComponents = this.hasContentOnSide("left", headings, currentPath);
        const hasRightComponents = this.hasContentOnSide("right", headings, currentPath);
        const hasAnyComponents = hasLeftComponents || hasRightComponents;

        // Desktop: Left if hasLeft, Right if hasRight
        const hasLeftSidebar = hasLeftComponents;
        const hasRightSidebar = hasRightComponents;

        // Dynamic grid layout class names
        const gridCols = `
            grid-cols-1
            ${hasAnyComponents ? "md:grid-cols-[17.5rem_1fr]" : "md:grid-cols-1"}
            ${
                hasLeftSidebar && hasRightSidebar
                    ? "lg:grid-cols-[17.5rem_1fr_17.5rem]"
                    : hasLeftSidebar
                        ? "lg:grid-cols-[17.5rem_1fr]"
                        : hasRightSidebar
                            ? "lg:grid-cols-[1fr_17.5rem]"
                            : "lg:grid-cols-1"
            }
        `.trim().replace(/\s+/g, " ");

        // Left sidebar container class name
        // Mobile: Hidden
        // Tablet: Visible if hasAnyComponents (merged)
        // Desktop: Visible if hasLeftSidebar
        const leftSidebarClass = `
            mb-0 col-span-1 hidden
            ${hasAnyComponents ? "md:flex md:flex-col md:max-w-70" : ""}
            ${hasLeftSidebar ? "lg:flex lg:flex-col lg:max-w-70 lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2" : "lg:hidden"}
        `.trim().replace(/\s+/g, " ");

        // Right sidebar container class name
        // Mobile: Hidden
        // Tablet: Hidden
        // Desktop: Visible if hasRightSidebar
        const rightSidebarClass = `
            mb-0 col-span-1 hidden
            md:hidden
            ${
                hasRightSidebar
                    ? hasLeftSidebar
                        ? "lg:flex lg:flex-col lg:max-w-70 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2"
                        : "lg:flex lg:flex-col lg:max-w-70 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                    : "lg:hidden"
            }
        `.trim().replace(/\s+/g, " ");

        // Mobile Footer class name
        // Always 1 col on mobile
        // 2 cols on tablet if sidebar is present
        const mobileFooterClass = `
            footer col-span-1 onload-animation-up block lg:hidden transition-swup-fade
            ${hasAnyComponents ? "md:col-span-2" : "md:col-span-1"}
        `.trim().replace(/\s+/g, " ");
        
        // Mobile sidebar class name
        const middleSidebarClass = `
            col-span-1 flex flex-col md:hidden
            ${!hasAnyComponents ? "hidden" : ""}
        `.trim().replace(/\s+/g, " ");

        // Main content area class name
        const mainContentClass = `
            overflow-hidden w-full
            col-span-1 row-start-1 row-end-2
            ${hasAnyComponents ? "md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2" : "md:col-span-1"}
            ${
                hasLeftSidebar && hasRightSidebar
                    ? "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                    : hasLeftSidebar
                        ? "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2"
                        : hasRightSidebar
                            ? "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2"
                            : "lg:col-span-1"
            }
        `.trim().replace(/\s+/g, " ");

        return {
            hasLeftSidebar,
            hasRightSidebar,
            hasAnyComponents,
            gridCols,
            leftSidebarClass,
            rightSidebarClass,
            mainContentClass,
            mobileFooterClass,
            middleSidebarClass,
        };
    }
}

/**
 * Default component manager instance
 */
export const widgetManager = new WidgetManager();

/**
 * Utility function: Get component configuration based on component type
 * @param componentType Component type
 */
export function getComponentConfig(
    componentType: WidgetComponentType,
): WidgetComponentConfig | undefined {
    const left = widgetManager.getConfig().components.left || [];
    const right = widgetManager.getConfig().components.right || [];
    return left.find((c) => c.type === componentType) ||
           right.find((c) => c.type === componentType);
}

/**
 * Utility function: Check if component is enabled
 * @param componentType Component type
 */
export function isComponentEnabled(
    componentType: WidgetComponentType,
): boolean {
    // By default, all components present in the configuration are considered enabled
    return !!getComponentConfig(componentType);
}

/**
 * Utility function: Get all enabled component types
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
    const enabledComponents = widgetManager.getComponentsByPosition("top").concat(
        widgetManager.getComponentsByPosition("sticky")
    );
    return enabledComponents.map((c) => c.type);
}

/**
 * Generic click-outside-to-close handler function
 * @param event Mouse event
 * @param panelId Panel ID
 * @param ignoreIds Element IDs to ignore (buttons, etc.), supports single ID or ID array
 * @param action Close callback
 */
export function onClickOutside(
    event: MouseEvent,
    panelId: string,
    ignoreIds: string | string[],
    action: () => void
) {
    if (typeof document === "undefined") {
        return;
    }
    const panel = document.getElementById(panelId);

    const target = event.target as HTMLElement;

    const ids = Array.isArray(ignoreIds) ? ignoreIds : [ignoreIds];
    
    // If the click is on an ignored element or its child, do not close
    for (const id of ids) {
        if (target.closest(`#${id}`)) {
            return;
        }
    }

    // If the panel exists and the click occurs outside it, perform the close operation
    if (panel && !panel.contains(target)) {
        action();
    }
}