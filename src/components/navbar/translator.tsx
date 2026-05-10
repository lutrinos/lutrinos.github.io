import { h } from 'preact';
import { useState, useEffect, useRef } from 'preact/hooks';

import { BREAKPOINT_LG } from "@constants/breakpoints";
import { onClickOutside } from "@utils/widget";
import DropdownItem from "@/components/common/DropdownItem.tsx";
import DropdownPanel from "@/components/common/DropdownPanel.tsx";
import Icon from "@components/common/icon";
import { LOCALE_CONFIG, SUPPORTED_LOCALES } from '@i18n/locales';

export default function Translator({ currentLocale }: { currentLocale?: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const translatePanelRef = useRef();

    function togglePanel() {
        setIsOpen(!isOpen);
    }

    function openPanel() {
        setIsOpen(true);
    }

    function closePanel() {
        setIsOpen(false);
    }

    // Click outside to close panel
    function handleClickOutside(event: any) {
        if (!isOpen) return;
        onClickOutside(event, "translate-panel", "translate-switch", () => {
            setIsOpen(false);
        });
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div class="relative z-50" onmouseleave={closePanel}>
            {/* Translation button */}
            <button
                aria-label="Language Translation"
                class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center"
                id="translate-switch"
                onclick={() => {
                    if (window.innerWidth < BREAKPOINT_LG) {
                        openPanel();
                    } else {
                        togglePanel();
                    }
                }}
                onmouseenter={openPanel}
            >
                <Icon icon="material-symbols:translate" class="text-[1.25rem] transition" />
            </button>
            {/* Translation panel */}
            <div id="translate-panel-wrapper" class={`fixed top-14.5 pt-5 right-4 w-[calc(100vw-2rem)] max-w-64 md:absolute md:top-11 md:right-0 md:w-64 md:pt-5 transition-all z-50 ${!isOpen ? 'float-panel-closed' : ''}`}>
                <DropdownPanel
                    ref={translatePanelRef}
                    id="translate-panel"
                    class="p-4 w-full"
                >
                    <div class="text-sm font-medium text-(--primary) mb-3 px-1">
                        Select Language
                    </div>
                    <div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                        {SUPPORTED_LOCALES.map(l => (
                            <DropdownItem
                                isActive={currentLocale === l}
                                onclick={() => {
                                    // changeLanguage(lang.code)
                                }}
                                class="gap-3 p-2! h-auto!"
                                isLast={false}
                                key={l}
                            >
                                <span class="text-lg transition">{LOCALE_CONFIG[l].icon}</span>
                                <span class="text-sm transition grow text-left">{LOCALE_CONFIG[l].displayName}</span>
                                {currentLocale === l && <span class="ml-auto text-(--primary)">✓</span>}
                            </DropdownItem>
                        ))}
                    </div>
                </DropdownPanel>
            </div>
        </div>
    );
}