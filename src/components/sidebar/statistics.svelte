<script lang="ts">
    import { onMount } from "svelte";
    import dayjs from "dayjs";

    import { BREAKPOINT_LG } from "@constants/breakpoints";
    import Icon from "@components/common/icon.svelte";

    let {
        posts = [],
        categories = [],
        tags = [],
        class: className = "",
        style = "",
        side = "default",
        labels = {}
    }: {
        posts?: any[];
        categories?: any[];
        tags?: any[];
        class?: string;
        style?: string;
        side?: string;
        labels: Record<string, string>
    } = $props();

    let container = $state<HTMLDivElement>();
    let isHeatmapLoading = $state(true);
    let isCategoriesLoading = $state(true);
    let isTagsLoading = $state(true);
    let isDesktop = $state(true);
    let isDark = $state(false);
    let isInitialized = $state(false);

    let timeScale: "year" | "month" | "day" = $state("year");

    const updateIsDesktop = () => {
        if (typeof window !== "undefined") {
            isDesktop = window.innerWidth >= BREAKPOINT_LG;
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
        const target = container ?? document.body ?? document.documentElement;
        const fontFamily = window.getComputedStyle(target).fontFamily;
        return fontFamily && fontFamily !== "inherit" ? fontFamily : fallback;
    };

    const buildHeatmapData = () => {
        const now = dayjs();
        const data: { label: string; value: number }[] = [];

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

    let themeColors = $state(getThemeColors());
    let fontFamily = $state(getChartsFontFamily());
    let heatmapData = $state(buildHeatmapData());
    let categoriesData: any[] = $state([]);
    let tagsData: any[] = $state([]);

    let heatmapSeries: any[] = $state([]);
    let categoriesSeries: any[] = $state([]);
    let tagsSeries: any[] = $state([]);

    $effect(() => {
        themeColors = getThemeColors();
    });
    $effect(() => {
        fontFamily = getChartsFontFamily();
    });
    $effect(() => {
        heatmapData = buildHeatmapData();
    });
    $effect(() => {
        categoriesData = categories;
    });
    $effect(() => {
        tagsData = [...tags].sort((a, b) => b.count - a.count).slice(0, 8);
    });
    $effect(() => {
        heatmapSeries = [
            { key: "activity", value: "value", color: themeColors.primary },
        ];
    });
    $effect(() => {
        categoriesSeries = [
            {
                key: "categories",
                value: "count",
                color: "rgba(255, 123, 0, 0.9)",
            },
        ];
    });
    $effect(() => {
        tagsSeries = [
            { key: "tags", value: "count", color: "rgba(16, 185, 129, 0.9)" },
        ];
    });

    const runInit = () => {
        if (!isInitialized) {
            isInitialized = true;
            isHeatmapLoading = false;
            isCategoriesLoading = false;
            isTagsLoading = false;
        }
    };

    onMount(() => {
        updateIsDesktop();
        isDark =
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark");

        let visibilityObserver: IntersectionObserver | undefined;
        const handleResize = () => updateIsDesktop();

        const handleThemeMutation = () => {
            const newIsDark =
                document.documentElement.classList.contains("dark");
            if (newIsDark !== isDark) {
                isDark = newIsDark;
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

        if (container) {
            visibilityObserver = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting) {
                    visibilityObserver?.disconnect();
                    start();
                }
            });
            visibilityObserver.observe(container);
        } else {
            start();
        }

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            themeObserver.disconnect();
            visibilityObserver?.disconnect();
        };
    });
</script>

<div
    id={`statistics-${side}`}
    data-swup-persist={`statistics-${side}`}
    bind:this={container}
    class={"pb-4 card-base " + className}
    {style}
>
    <div
        class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2
        before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
        before:absolute before:left-[-16px] before:top-[5.5px]"
    >
        {labels.statistics}
    </div>
    <div class="px-4 overflow-hidden relative min-h-[180px]">
        <div class="stats-charts">
            <div class="chart-section heatmap-section">
                {#if isHeatmapLoading}
                    <div
                        class="absolute inset-0 flex items-center justify-center z-10 bg-(--card-bg)/50 backdrop-blur-[1px]"
                    >
                        <div
                            class="text-(--primary) flex items-center justify-center"
                        >
                            <Icon
                                icon="material-symbols:progress-activity"
                                class="animate-spin"
                                style="font-size: 2.4rem;"
                            />
                        </div>
                    </div>
                {/if}
                <div class="section-header">
                    <div class="dropdown-wrapper">
                        <button
                            class="time-scale-select flex items-center gap-1"
                        >
                            {labels[timeScale]}
                            <span class="dropdown-icon flex items-center">
                                <Icon
                                    icon="material-symbols:keyboard-arrow-down-rounded"
                                />
                            </span>
                        </button>
                        <div class="dropdown-menu-custom">
                            <button
                                class="dropdown-item-custom"
                                class:active={timeScale === "year"}
                                onclick={() => (timeScale = "year")}
                                >{labels.year}</button
                            >
                            <button
                                class="dropdown-item-custom"
                                class:active={timeScale === "month"}
                                onclick={() => (timeScale = "month")}
                                >{labels.month}</button
                            >
                            <button
                                class="dropdown-item-custom"
                                class:active={timeScale === "day"}
                                onclick={() => (timeScale = "day")}
                                >{labels.day}</button
                            >
                        </div>
                    </div>
                </div>
                <div
                    class="heatmap-container transition-opacity duration-600"
                    class:opacity-0={isHeatmapLoading}
                >
                    <!--{#if isInitialized}
                        <LineChart
                            data={heatmapData}
                            x="label"
                            y="value"
                            height={180}
                            padding={{
                                top: 30,
                                right: 20,
                                bottom: 20,
                                left: 30,
                            }}
                            grid={{
                                x: false,
                                y: { stroke: themeColors.grid, opacity: 0.35 },
                            }}
                            props={{
                                spline: {
                                    fill: themeColors.areaStart,
                                    stroke: themeColors.primary,
                                    strokeWidth: 3,
                                    fillOpacity: 0.35,
                                    opacity: 0.95,
                                },
                            }}
                            style={`font-family:${fontFamily}; color:${themeColors.text};`}
                        />
                    {/if}-->
                </div>
            </div>

            {#if isDesktop}
                <div class="chart-section radar-section">
                    {#if isCategoriesLoading}
                        <div
                            class="absolute inset-0 flex items-center justify-center z-10 bg-(--card-bg)/50 backdrop-blur-[1px]"
                        >
                            <div
                                class="text-(--primary) flex items-center justify-center"
                            >
                                <Icon
                                    icon="material-symbols:progress-activity"
                                    class="animate-spin"
                                    style="font-size: 2.4rem;"
                                />
                            </div>
                        </div>
                    {/if}
                    <div
                        class="radar-container transition-opacity duration-600"
                        class:opacity-0={isCategoriesLoading}
                    >
                        <!--{#if isInitialized}
                            <LineChart
                                data={categoriesData}
                                x="name"
                                y="count"
                                radial
                                height={250}
                                padding={{
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 20,
                                }}
                                axis={false}
                                //series={categoriesSeries}
                                props={{
                                    spline: {
                                        fill: "rgba(255, 123, 0, 0.6)",
                                        stroke: "rgba(255, 123, 0, 0.9)",
                                        strokeWidth: 2,
                                        opacity: 0.95,
                                    },
                                    xAxis: {
                                        tickLength: 0,
                                    },
                                    yAxis: {
                                        ticks: [0, 5, 10],
                                        format: (d) => "",
                                    },
                                    grid: {
                                        yTicks: [0, 5, 10],
                                        radialY: "linear",
                                    },
                                    highlight: {
                                        lines: false,
                                    },
                                }}
                                tooltipContext={{ mode: "quadtree-y" }}
                                style={`font-family:${fontFamily}; color:${themeColors.text};`}
                            />
                            <LineChart
                                data={categoriesData}
                                x="name"
                                y="count"
                                padding={{
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 20,
                                }}
                                radial
                                points
                                grid={{
                                    yTicks: [0, 5, 10],
                                    radialY: "linear",
                                }}
                                props={{
                                    spline: {
                                        fill: "rgba(255, 123, 0, 0.6)",
                                        stroke: "rgba(255, 123, 0, 0.9)",
                                        strokeWidth: 2,
                                        opacity: 0.95,
                                    },
                                    highlight: {
                                        lines: false,
                                    },
                                }}
                                tooltipContext={{ mode: "voronoi" }}
                                height={180}
                                style={`font-family:${fontFamily}; color:${themeColors.text};`}
                            />
                        {/if}-->
                    </div>
                </div>

                <div class="chart-section radar-section">
                    {#if isTagsLoading}
                        <div
                            class="absolute inset-0 flex items-center justify-center z-10 bg-(--card-bg)/50 backdrop-blur-[1px]"
                        >
                            <div
                                class="text-(--primary) flex items-center justify-center"
                            >
                                <Icon
                                    icon="material-symbols:progress-activity"
                                    class="animate-spin"
                                    style="font-size: 2.4rem;"
                                />
                            </div>
                        </div>
                    {/if}
                    <div
                        class="radar-container transition-opacity duration-600"
                        class:opacity-0={isTagsLoading}
                    >
                        <!--{#if isInitialized}
                            <LineChart
                                data={tagsData}
                                radial={true}
                                x="name"
                                y="count"
                                height={180}
                                padding={{
                                    top: 20,
                                    right: 20,
                                    bottom: 20,
                                    left: 20,
                                }}
                                points
                                grid={{
                                    yTicks: [0, 5, 10],
                                    radialY: "linear",
                                }}
                                props={{
                                    spline: {
                                        fill: "rgba(16, 185, 129, 0.6)",
                                        stroke: "rgba(16, 185, 129, 0.9)",
                                        strokeWidth: 2,
                                        opacity: 0.95,
                                    },
                                    highlight: {
                                        lines: false,
                                    },
                                }}
                                tooltipContext={{ mode: "voronoi" }}
                                style={`font-family:${fontFamily}; color:${themeColors.text};`}
                            />
                        {/if}-->
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .stats-charts {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        width: 100%;
    }
    .chart-section {
        width: 100%;
        position: relative;
    }
    .heatmap-section {
        position: relative;
    }
    .section-header {
        position: absolute;
        right: 0;
        top: 0;
        z-index: 10;
    }
    .time-scale-select {
        display: flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        background: var(--btn-regular-bg);
        color: var(--btn-content);
        border: 1px solid var(--line-color);
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.2s;
        outline: none;
    }
    .time-scale-select:hover {
        opacity: 1;
        border-color: var(--primary);
    }
    .dropdown-wrapper {
        position: relative;
        display: inline-block;
    }
    .dropdown-wrapper:hover .dropdown-menu-custom {
        opacity: 1;
        visibility: visible;
        translate: 0 0;
    }
    .dropdown-menu-custom {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 4px;
        background: var(--card-bg);
        border: 1px solid var(--line-color);
        border-radius: 4px;
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        opacity: 0;
        visibility: hidden;
        translate: 0 -10px;
        transition: all 0.2s;
        z-index: 50;
        min-width: 80px;
        overflow: hidden;
    }
    .dropdown-item-custom {
        width: 100%;
        text-align: left;
        padding: 6px 12px;
        font-size: 0.7rem;
        color: var(--btn-content);
        background: transparent;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }
    .dropdown-item-custom:hover {
        background: var(--btn-plain-bg-hover);
        color: var(--primary);
    }
    .dropdown-item-custom.active {
        color: var(--primary);
        font-weight: bold;
        background: var(--btn-plain-bg-hover);
    }
    .dropdown-icon {
        font-size: 0.9rem;
        transition: rotate 0.2s;
    }
    .dropdown-wrapper:hover .dropdown-icon {
        rotate: 180deg;
    }
    .heatmap-container {
        height: 180px;
        width: 100%;
    }
    .radar-container {
        height: 250px;
        width: 100%;
    }
</style>
