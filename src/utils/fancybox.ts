let fancyboxSelectors: string[] = [];
let Fancybox: any;

// Image lightbox loading on demand
export async function initFancybox() {
    if (typeof document === "undefined") return;
    // Album image selector (only bind images not inside an <a> tag to avoid conflict with link binding)
    const albumImagesSelector = ".custom-md img:not(a *), #post-cover img:not(a *), .moment-images img:not(a *), .photo-gallery img:not(a *)";
    // Album link selector
    const albumLinksSelector = ".moment-images a[data-fancybox], .photo-gallery a[data-fancybox]";
    // Single image selector
    const singleFancyboxSelector = "[data-fancybox]:not(.moment-images a):not(.photo-gallery a)";
    // Check if there are images that need to be bound
    const hasImages =
        document.querySelector(albumImagesSelector) ||
        document.querySelector(albumLinksSelector) ||
        document.querySelector(singleFancyboxSelector);
    if (!hasImages) return;
    // Check if Fancybox is already initialized
    if (!Fancybox) {
        const mod = await import("@fancyapps/ui");
        Fancybox = mod.Fancybox;
        await import("@fancyapps/ui/dist/fancybox/fancybox.css");
    }
    if (fancyboxSelectors.length > 0) {
        return; // Already initialized, return directly
    }
    // Common configuration
    const commonConfig = {
        Thumbs: {
            autoStart: true,
            showOnStart: "yes"
        },
        Toolbar: {
            display: {
                left: ["infobar"],
                middle: [
                    "zoomIn",
                    "zoomOut",
                    "toggle1to1",
                    "rotateCCW",
                    "rotateCW",
                    "flipX",
                    "flipY",
                ],
                right: ["slideshow", "thumbs", "close"],
            },
        },
        animated: true,
        dragToClose: true,
        keyboard: {
            Escape: "close",
            Delete: "close",
            Backspace: "close",
            PageUp: "next",
            PageDown: "prev",
            ArrowUp: "next",
            ArrowDown: "prev",
            ArrowRight: "next",
            ArrowLeft: "prev",
        },
        fitToView: true,
        preload: 3,
        infinite: true,
        Panzoom: {
            maxScale: 3,
            minScale: 1
        },
        caption: false,
    };
    // Bind album/post images
    Fancybox.bind(albumImagesSelector, {
        ...commonConfig,
        groupAll: true,
        Carousel: {
            transition: "slide",
            preload: 2,
        },
    });
    fancyboxSelectors.push(albumImagesSelector);
    // Bind album links
    Fancybox.bind(albumLinksSelector, {
        ...commonConfig,
        source: (el: any) => {
            return el.getAttribute("data-src") || el.getAttribute("href");
        },
    });
    fancyboxSelectors.push(albumLinksSelector);
    // Bind individual fancybox images
    Fancybox.bind(singleFancyboxSelector, commonConfig);
    fancyboxSelectors.push(singleFancyboxSelector);
}

// Cleanup Fancybox instance
export function cleanupFancybox() {
    if (!Fancybox) return; // If never loaded, no cleanup needed
    fancyboxSelectors.forEach((selector) => {
        Fancybox.unbind(selector);
    });
    fancyboxSelectors = [];
}