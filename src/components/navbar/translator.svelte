<script lang="ts">
import { onDestroy } from "svelte";

import { BREAKPOINT_LG } from "@constants/breakpoints";
import { onClickOutside } from "@utils/widget";
import { siteConfig } from "@/config";
import DropdownItem from "@/components/common/DropdownItem.svelte";
import DropdownPanel from "@/components/common/DropdownPanel.svelte";
import Icon from "@components/common/icon.svelte";


let isOpen = $state(false);
let translatePanel: HTMLElement | undefined = $state();

// 从统一配置动态获取支持的语言列表
const { languages, currentLanguage } = $props();

function togglePanel() {
    isOpen = !isOpen;
}

function openPanel() {
    isOpen = true;
}

function closePanel() {
    isOpen = false;
}

// 点击外部关闭面板
function handleClickOutside(event: MouseEvent) {
    if (!isOpen) return;
    onClickOutside(event, "translate-panel", "translate-switch", () => {
        isOpen = false;
    });
}

onDestroy(() => {
    if (typeof document !== "undefined") {
        document.removeEventListener("click", handleClickOutside);
    }
});
</script>

{#if siteConfig.translate?.enable}
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="relative z-50" onmouseleave={closePanel}>
    <!-- 翻译按钮 -->
    <button
        aria-label="Language Translation"
        class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center"
        id="translate-switch"
        onclick={() => { if (window.innerWidth < BREAKPOINT_LG) { openPanel(); } else { togglePanel(); } }}
        onmouseenter={openPanel}
    >
        <Icon icon="material-symbols:translate" class="text-[1.25rem] transition" />
    </button>
    <!-- 翻译面板 -->
    <div id="translate-panel-wrapper" class="fixed top-14.5 pt-5 right-4 w-[calc(100vw-2rem)] max-w-64 md:absolute md:top-11 md:right-0 md:w-64 md:pt-5 transition-all z-50" class:float-panel-closed={!isOpen}>
        <DropdownPanel
            bind:element={translatePanel}
            id="translate-panel"
            class="p-4 w-full"
        >
            <div class="text-sm font-medium text-(--primary) mb-3 px-1">
                选择语言 / Select Language
            </div>
            <div class="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {#each languages as lang}
                    <DropdownItem
                        isActive={currentLanguage === lang.code}
                        //onclick={() => changeLanguage(lang.code)}
                        class="gap-3 p-2! h-auto!"
                        isLast={false}
                    >
                        <span class="text-lg transition">{lang.icon}</span>
                        <span class="text-sm transition grow text-left">{lang.name}</span>
                        {#if currentLanguage === lang.code}
                            <span class="ml-auto text-(--primary)">✓</span>
                        {/if}
                    </DropdownItem>
                {/each}
            </div>
        </DropdownPanel>
    </div>
</div>
{/if}

<style>
/* 滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
    width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: var(--scrollbar-bg);
    border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-bg-hover);
}
</style>