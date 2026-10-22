import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import { url } from "@utils/url";
import { navigateToPage } from "@utils/navigation";
import { onClickOutside } from "@utils/widget";
import DropdownPanel from "@/components/common/DropdownPanel.jsx";
import Icon from "@components/common/icon.jsx";

export default function Search({ searchLabel }) {
    const [keywordDesktop, setKeywordDesktop] = useState("");
    const [keywordMobile, setKeywordMobile] = useState("");
    const [result, setResult] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [pagefindLoaded, setPagefindLoaded] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [isDesktopSearchExpanded, setIsDesktopSearchExpanded] = useState(false);
    const debounceTimerRef = useRef(null);

    const fakeResult = [
        {
            url: url("/"),
            meta: {
                title: "This Is a Fake Search Result",
            },
            excerpt:
                "Because the search cannot work in the <mark>dev</mark> environment.",
        },
        {
            url: url("/"),
            meta: {
                title: "If You Want to Test the Search",
            },
            excerpt: "Try running <mark>npm build && npm preview</mark> instead.",
        },
    ];

    const togglePanel = () => {
        const panel = document.getElementById("search-panel");
        panel?.classList.toggle("float-panel-closed");
    };

    const toggleDesktopSearch = () => {
        setIsDesktopSearchExpanded(!isDesktopSearchExpanded);
        if (!isDesktopSearchExpanded) {
            setTimeout(() => {
                const input = document.getElementById("search-input-desktop");
                input?.focus();
            }, 0);
        }
    };

    const collapseDesktopSearch = () => {
        if (!keywordDesktop) {
            setIsDesktopSearchExpanded(false);
        }
    };

    const handleBlur = () => {
        // Delay to allow click events on results
        setTimeout(() => {
            setIsDesktopSearchExpanded(false);
            setPanelVisibility(false, true);
        }, 200);
    };

    const setPanelVisibility = (show, isDesktop) => {
        const panel = document.getElementById("search-panel");
        if (!panel || !isDesktop) return;
        if (show) {
            panel.classList.remove("float-panel-closed");
        } else {
            panel.classList.add("float-panel-closed");
        }
    };

    const closeSearchPanel = () => {
        const panel = document.getElementById("search-panel");
        if (panel) {
            panel.classList.add("float-panel-closed");
        }
        setKeywordDesktop("");
        setKeywordMobile("");
        setResult([]);
    };

    const handleResultClick = (event, url) => {
        event.preventDefault();
        closeSearchPanel();
        navigateToPage(url);
    };

    const search = async (keyword, isDesktop) => {
        if (!keyword) {
            setPanelVisibility(false, isDesktop);
            setResult([]);
            return;
        }
        if (!initialized) {
            return;
        }
        setIsSearching(true);
        try {
            let searchResults = [];
            if (import.meta.env.PROD && pagefindLoaded && window.pagefind) {
                const response = await window.pagefind.search(keyword);
                searchResults = await Promise.all(
                    response.results.map((item) => item.data()),
                );
            } else if (import.meta.env.DEV) {
                searchResults = fakeResult;
            } else {
                searchResults = [];
                console.error("Pagefind is not available in production environment.");
            }
            setResult(searchResults);
            setPanelVisibility(searchResults.length > 0, isDesktop);
        } catch (error) {
            console.error("Search error:", error);
            setResult([]);
            setPanelVisibility(false, isDesktop);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClickOutside = (event) => {
        const panel = document.getElementById("search-panel");
        if (!panel || panel.classList.contains("float-panel-closed")) {
            return;
        }
        onClickOutside(event, "search-panel", ["search-switch", "search-bar"], () => {
            const panel = document.getElementById("search-panel");
            panel?.classList.add("float-panel-closed");
            setIsDesktopSearchExpanded(false);
        });
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        const initializeSearch = () => {
            setInitialized(true);
            setPagefindLoaded(
                typeof window !== "undefined" &&
                !!window.pagefind &&
                typeof window.pagefind.search === "function"
            );
            console.log("Pagefind status on init:", pagefindLoaded);
        };
        if (import.meta.env.DEV) {
            console.log(
                "Pagefind is not available in development mode. Using mock data.",
            );
            initializeSearch();
        } else {
            document.addEventListener("pagefindready", () => {
                console.log("Pagefind ready event received.");
                initializeSearch();
            });
            document.addEventListener("pagefindloaderror", () => {
                console.warn(
                    "Pagefind load error event received. Search functionality will be limited.",
                );
                initializeSearch(); // Initialize with pagefindLoaded as false
            });
            // Fallback
            setTimeout(() => {
                if (!initialized) {
                    console.log("Fallback: Initializing search after timeout.");
                    initializeSearch();
                }
            }, 2000);
        }

        return () => {
            document.removeEventListener("click", handleClickOutside);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (initialized) {
            const keyword = keywordDesktop || keywordMobile;
            const isDesktop = !!keywordDesktop || isDesktopSearchExpanded;

            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            if (keyword) {
                debounceTimerRef.current = setTimeout(() => {
                    search(keyword, isDesktop);
                }, 300);
            } else {
                setResult([]);
                setPanelVisibility(false, isDesktop);
            }
        }
    }, [keywordDesktop, keywordMobile, initialized, isDesktopSearchExpanded]);

    useEffect(() => {
        const navbar = document.getElementById('navbar');
        if (isDesktopSearchExpanded) {
            navbar?.classList.add('is-searching');
        } else {
            navbar?.classList.remove('is-searching');
        }

        return () => {
            navbar?.classList.remove('is-searching');
        };
    }, [isDesktopSearchExpanded]);

    return (
        <>
            {/* search bar for desktop view (collapsed by default) */}
            <div
                id="search-bar"
                class={`hidden lg:flex transition-all items-center h-11 rounded-lg ${
                    isDesktopSearchExpanded ? 'bg-black/4 hover:bg-black/6 focus-within:bg-black/6 dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10' : 'btn-plain scale-animation active:scale-90'
                } ${isDesktopSearchExpanded ? 'w-48' : 'w-11'}`}
                role="button"
                tabindex="0"
                aria-label="Search"
                onmouseenter={() => {if (!isDesktopSearchExpanded) toggleDesktopSearch()}}
                onmouseleave={collapseDesktopSearch}
            >
                <Icon icon="material-symbols:search" class={`absolute text-[1.25rem] pointer-events-none ${isDesktopSearchExpanded ? 'ml-3' : 'left-1/2 -translate-x-1/2'} transition my-auto ${isDesktopSearchExpanded ? 'text-black/30 dark:text-white/30' : ''}`} />
                <input id="search-input-desktop" placeholder={searchLabel} value={keywordDesktop}
                    onInput={(e) => setKeywordDesktop(e.target.value)}
                    onfocus={() => {if (!isDesktopSearchExpanded) toggleDesktopSearch(); search(keywordDesktop, true)}}
                    onblur={handleBlur}
                    class={`transition-all pl-10 text-sm bg-transparent outline-0 h-full ${isDesktopSearchExpanded ? 'w-36' : 'w-0'} text-black/50 dark:text-white/50`}
                />
            </div>

            {/* toggle btn for phone/tablet view */}
            <button onclick={togglePanel} aria-label="Search Panel" id="search-switch"
                    class="btn-plain scale-animation lg:hidden! rounded-lg w-11 h-11 active:scale-90 flex items-center justify-center">
                <Icon icon="material-symbols:search" class="text-[1.25rem]" />
            </button>

            {/* search panel */}
            <DropdownPanel
                    id="search-panel"
                    class="float-panel-closed absolute md:w-120 top-20 left-4 md:left-[unset] right-4 z-50 search-panel"
            >
                {/* search bar inside panel for phone/tablet */}
                <div id="search-bar-inside" class="flex relative lg:hidden transition-all items-center h-11 rounded-xl
          bg-black/4 hover:bg-black/6 focus-within:bg-black/6
          dark:bg-white/5 dark:hover:bg-white/10 dark:focus-within:bg-white/10
      ">
                    <Icon icon="material-symbols:search" class="absolute text-[1.25rem] pointer-events-none ml-3 transition my-auto text-black/30 dark:text-white/30" />
                    <input placeholder="Search" value={keywordMobile}
                           onInput={(e) => setKeywordMobile(e.target.value)}
                           class="pl-10 absolute inset-0 text-sm bg-transparent outline-0
               focus:w-60 text-black/50 dark:text-white/50"
                    />
                </div>
                {/* search results */}
                {result.map(item => (
                    <a href={item.url}
                       onclick={(e) => handleResultClick(e, item.url)}
                       class="transition first-of-type:mt-2 lg:first-of-type:mt-0 group block
               rounded-xl text-lg px-3 py-2 hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active)"
                       key={item.url}
                    >
                        <div class="transition text-90 inline-flex font-bold group-hover:text-(--primary)">
                            {item.meta.title}<Icon icon="fa6-solid:chevron-right" class="transition text-[0.75rem] translate-x-1 my-auto text-(--primary)" />
                        </div>
                        <div class="transition text-sm text-50" dangerouslySetInnerHTML={{ __html: item.excerpt }} />
                    </a>
                ))}
            </DropdownPanel>
        </>
    );
}