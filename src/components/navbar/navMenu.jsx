import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import { url } from "@utils/url";
import { onClickOutside } from "@utils/widget";
import Icon from "@components/common/icon.jsx";

export default function NavMenu({ links }) {
    const [isOpen, setIsOpen] = useState(false);

    function togglePanel() {
        setIsOpen(!isOpen);
    }

    // Click outside to close panel
    function handleClickOutside(event) {
        if (!isOpen) return;
        onClickOutside(event, "nav-menu-panel", "nav-menu-switch", () => {
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
        <div class="relative md:hidden">
            <button aria-label="Menu" name="Nav Menu" class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90"
                id="nav-menu-switch"
                onclick={togglePanel}
            >
                <Icon icon="material-symbols:menu-rounded" class="text-[1.25rem]" />
            </button>
            <div id="nav-menu-panel"
                class={`float-panel fixed transition-all right-4 px-2 py-2 max-h-[80vh] overflow-y-auto ${!isOpen ? 'float-panel-closed' : ''}`}
            >
                {links.map(link => (
                    <div class="mobile-menu-item" key={link.url}>
                        <a href={link.external ? link.url : url(link.url)}
                            class="group flex justify-between items-center py-2 pl-3 pr-1 rounded-lg gap-8 hover:bg-(--btn-plain-bg-hover) active:bg-(--btn-plain-bg-active) transition"
                            target={link.external ? "_blank" : null}
                        >
                            <div class="flex items-center transition text-black/75 dark:text-white/75 font-bold group-hover:text-(--primary) group-active:text-(--primary)">
                                {link.icon && <Icon icon={link.icon} class="text-[1.1rem] mr-2" />}
                                {link.name}
                            </div>
                            {!link.external ? (
                                <Icon icon="material-symbols:chevron-right-rounded" class="transition text-[1.25rem] text-(--primary)" />
                            ) : (
                                <Icon icon="fa6-solid:arrow-up-right-from-square" class="transition text-[0.75rem] text-black/25 dark:text-white/25 -translate-x-1" />
                            )}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}