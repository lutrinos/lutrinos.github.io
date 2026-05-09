import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { BREAKPOINT_LG } from "@constants/breakpoints";
import { getDefaultHue, getHue, setHue } from "@utils/hue";
import { onClickOutside } from "@utils/widget";
import Icon from "@components/common/icon.jsx";

export default function DisplaySettings({ themeColor }) {
    const [hue, setHueState] = useState(getDefaultHue());
    const defaultHue = getDefaultHue();
    const [isOpen, setIsOpen] = useState(false);

    function resetHue() {
        setHueState(getDefaultHue());
    }

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
    function handleClickOutside(event) {
        if (!isOpen) return;
        onClickOutside(
            event,
            "display-setting",
            "display-settings-switch",
            () => {
                setIsOpen(false);
            },
        );
    }

    useEffect(() => {
        setHueState(getHue());
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (hue || hue === 0) {
            setHue(hue);
        }
    }, [hue]);

    return (
        <div class="relative z-50" onmouseleave={closePanel}>
            <button
                aria-label="Display Settings"
                class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center"
                id="display-settings-switch"
                onclick={() => {
                    if (window.innerWidth < BREAKPOINT_LG) {
                        openPanel();
                    } else {
                        togglePanel();
                    }
                }}
                onmouseenter={openPanel}
            >
                <Icon icon="material-symbols:palette-outline" class="text-[1.25rem]" />
            </button>
            <div
                id="display-setting-wrapper"
                class={`fixed top-14.5 pt-5 right-4 w-[calc(100vw-2rem)] max-w-80 md:absolute md:top-11 md:right-0 md:w-80 md:pt-5 transition-all z-50 ${!isOpen ? 'float-panel-closed' : ''}`}
            >
                <div
                    id="display-setting"
                    class="card-base float-panel px-4 py-4 w-full"
                >
                    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
                        <div
                            class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
                    before:w-1 before:h-4 before:rounded-md before:bg-(--primary)
                    before:absolute before:-left-3 before:top-[0.33rem]"
                        >
                            {themeColor}
                            <button
                                aria-label="Reset to Default"
                                class={`btn-regular w-7 h-7 rounded-md active:scale-90 flex items-center justify-center ${hue === defaultHue ? 'opacity-0 pointer-events-none' : ''}`}
                                onclick={resetHue}
                            >
                                <div class="text-(--btn-content) flex items-center justify-center">
                                    <Icon
                                        icon="fa6-solid:arrow-rotate-left"
                                        class="text-[0.875rem]"
                                    />
                                </div>
                            </button>
                        </div>
                        <div class="flex gap-1">
                            <div
                                id="hueValue"
                                class="transition bg-(--btn-regular-bg) w-10 h-7 rounded-md flex justify-center
                    font-bold text-sm items-center text-(--btn-content)"
                            >
                                {hue}
                            </div>
                        </div>
                    </div>
                    <div
                        class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded-sm select-none"
                    >
                        <input
                            aria-label={themeColor}
                            type="range"
                            min="0"
                            max="360"
                            value={hue}
                            onInput={(e) => setHueState(parseInt(e.target.value))}
                            class="slider"
                            id="colorSlider"
                            step="5"
                            style="width: 100%"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}