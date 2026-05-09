import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { BREAKPOINT_LG } from "@constants/breakpoints";
import { SYSTEM_MODE, DARK_MODE, LIGHT_MODE } from "@constants/constants";
import {
    getStoredTheme,
    setTheme,
} from "@utils/theme";
import { onClickOutside } from "@utils/widget";
import { siteConfig } from "@/config";
import DropdownItem from "@/components/common/DropdownItem.jsx";
import DropdownPanel from "@/components/common/DropdownPanel.jsx";
import Icon from "@components/common/icon.jsx";

export default function LightDarkSwitch({ lightMode, darkMode, systemMode }) {
    const seq = [LIGHT_MODE, DARK_MODE, SYSTEM_MODE];
    const [mode, setModeState] = useState(siteConfig.defaultTheme || SYSTEM_MODE);
    const [isOpen, setIsOpen] = useState(false);

    function switchScheme(newMode) {
        setModeState(newMode);
        setTheme(newMode);
    }

    function toggleScheme() {
        let i = 0;
        for (; i < seq.length; i++) {
            if (seq[i] === mode) {
                break;
            }
        }
        switchScheme(seq[(i + 1) % seq.length]);
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
        onClickOutside(event, "light-dark-panel", "scheme-switch", () => {
            setIsOpen(false);
        });
    }

    useEffect(() => {
        setModeState(getStoredTheme());
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div class="relative z-50" role="menu" tabindex="-1" onmouseleave={closePanel}>
            <button aria-label="Light/Dark/System Mode" role="menuitem" class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center" id="scheme-switch" onmouseenter={openPanel} onclick={() => { if (window.innerWidth < BREAKPOINT_LG) { openPanel(); } else { toggleScheme(); } }}>
                <div class={`absolute inset-0 flex items-center justify-center ${mode !== LIGHT_MODE ? 'opacity-0' : ''}`}>
                    <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem]" />
                </div>
                <div class={`absolute inset-0 flex items-center justify-center ${mode !== DARK_MODE ? 'opacity-0' : ''}`}>
                    <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem]" />
                </div>
                <div class={`absolute inset-0 flex items-center justify-center ${mode !== SYSTEM_MODE ? 'opacity-0' : ''}`}>
                    <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem]" />
                </div>
            </button>
            <div id="light-dark-panel" class={`absolute transition top-11 -right-2 pt-5 ${!isOpen ? 'float-panel-closed' : ''}`}>
                <DropdownPanel>
                    <DropdownItem
                        isActive={mode === LIGHT_MODE}
                        isLast={false}
                        onclick={() => switchScheme(LIGHT_MODE)}
                    >
                        <Icon icon="material-symbols:wb-sunny-outline-rounded" class="text-[1.25rem] mr-3" />
                        {lightMode}
                    </DropdownItem>
                    <DropdownItem
                        isActive={mode === DARK_MODE}
                        isLast={false}
                        onclick={() => switchScheme(DARK_MODE)}
                    >
                        <Icon icon="material-symbols:dark-mode-outline-rounded" class="text-[1.25rem] mr-3" />
                        {darkMode}
                    </DropdownItem>
                    <DropdownItem
                        isActive={mode === SYSTEM_MODE}
                        isLast={true}
                        onclick={() => switchScheme(SYSTEM_MODE)}
                    >
                        <Icon icon="material-symbols:radio-button-partial-outline" class="text-[1.25rem] mr-3" />
                        {systemMode}
                    </DropdownItem>
                </DropdownPanel>
            </div>
        </div>
    );
}