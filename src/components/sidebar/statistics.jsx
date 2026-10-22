import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';
import dayjs from "dayjs";

import { BREAKPOINT_LG } from "@constants/breakpoints";
import Icon from "@components/common/icon.jsx";

export default function Statistics({ posts = [], categories = [], tags = [], class: className = "", style = "", side = "default", labels = {} }) {
    const containerRef = useRef();
    const [isHeatmapLoading, setIsHeatmapLoading] = useState(true);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [isTagsLoading, setIsTagsLoading] = useState(true);
    const [isDesktop, setIsDesktop] = useState(true);
    const [isDark, setIsDark] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [timeScale, setTimeScale] = useState("year");

    const updateIsDesktop = () => {
        if (typeof window !== "undefined") {
            setIsDesktop(window.innerWidth >= BREAKPOINT_LG);
        }
    };

    const getThemeColors = () => {
        const isDarkNow =
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark");
        return {
            text: isDarkNow ? "#e5e7eb" : "#374151",
            primary: isDarkNow ? "#60a5fa" : "#3b82f6",
            grid: isDarkNow ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
            areaStart: isDarkNow
                ? "rgba(96, 165, 250, 0.5)"
                : "rgba(59, 130, 246, 0.5)",
            areaEnd: isDarkNow
                ? "rgba(96, 165, 250, 0)"
                : "rgba(59, 130, 246, 0)",
        };
    };

    const getChartsFontFamily = () => {
        const fallback =
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
        if (typeof window === "undefined") return fallback;
        const target = containerRef.current ?? document.body ?? document.documentElement;
        const fontFamily = window.getComputedStyle(target).fontFamily;
        return fontFamily && fontFamily !== "inherit" ? fontFamily : fallback;
    };

    // Simplified heatmap data
    const buildHeatmapData = () => {
        const now = dayjs();
        const data = [];

        if (timeScale === "year") {
            const oldestYear =
                posts.length > 0
                    ? Math.min(
                          ...posts.map((p) => dayjs(p.data.published).year()),
                      )
                    : now.year();
            const currentYear = now.year();
            const startYear = Math.min(oldestYear, currentYear - 4);

            for (let year = startYear; year <= currentYear; year++) {
                const yearStr = year.toString();
                const count = posts.filter(
                    (p) => dayjs(p.data.published).year() === year,
                ).length;
                data.push({ label: yearStr, value: count });
            }
        } else if (timeScale === "month") {
            for (let i = 11; i >= 0; i--) {
                const month = now.subtract(i, "month");
                const monthStr = month.format("YYYY-MM");
                const count = posts.filter(
                    (p) =>
                        dayjs(p.data.published).format("YYYY-MM") === monthStr,
                ).length;
                data.push({ label: month.format("MMM"), value: count });
            }
        } else {
            for (let i = 29; i >= 0; i--) {
                const day = now.subtract(i, "day");
                const dayStr = day.format("YYYY-MM-DD");
                const count = posts.filter(
                    (p) =>
                        dayjs(p.data.published).format("YYYY-MM-DD") === dayStr,
                ).length;
                data.push({ label: day.format("DD"), value: count });
            }
        }

        return data;
    };

    const [themeColors, setThemeColors] = useState(getThemeColors());
    const [fontFamily, setFontFamily] = useState(getChartsFontFamily());
    const [heatmapData, setHeatmapData] = useState(buildHeatmapData());
    const [categoriesData, setCategoriesData] = useState(categories);
    const [tagsData, setTagsData] = useState(tags.slice().sort((a, b) => b.count - a.count).slice(0, 8));

    useEffect(() => {
        setThemeColors(getThemeColors());
    }, []);

    useEffect(() => {
        setFontFamily(getChartsFontFamily());
    }, []);

    useEffect(() => {
        setHeatmapData(buildHeatmapData());
    }, [timeScale, posts]);

    useEffect(() => {
        setCategoriesData(categories);
    }, [categories]);

    useEffect(() => {
        setTagsData(tags.slice().sort((a, b) => b.count - a.count).slice(0, 8));
    }, [tags]);

    const runInit = () => {
        if (!isInitialized) {
            setIsInitialized(true);
            setIsHeatmapLoading(false);
            setIsCategoriesLoading(false);
            setIsTagsLoading(false);
        }
    };

    useEffect(() => {
        updateIsDesktop();
        setIsDark(
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark")
        );

        let visibilityObserver;
        const handleResize = () => updateIsDesktop();

        const handleThemeMutation = () => {
            const newIsDark =
                document.documentElement.classList.contains("dark");
            if (newIsDark !== isDark) {
                setIsDark(newIsDark);
            }
        };

        const themeObserver = new MutationObserver(handleThemeMutation);
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        const start = () => {
            if (!isInitialized) runInit();
        };

        if (containerRef.current) {
            visibilityObserver = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting) {
                    visibilityObserver?.disconnect();
                    start();
                }
            });
            visibilityObserver.observe(containerRef.current);
        }

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            themeObserver.disconnect();
            visibilityObserver?.disconnect();
        };
    }, []);

    // Placeholder for charts - in a real conversion, implement with uPlot or similar
    return (
        <div ref={containerRef} class={className} style={style}>
            <div>Statistics Component - Charts would go here</div>
        </div>
    );
}