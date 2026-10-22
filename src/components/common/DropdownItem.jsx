/**
 * Common dropdown panel item component (Preact version)
 * Used for options in dropdown panels
 */
import { h } from 'preact';

export default function DropdownItem({ isActive = false, isLast = false, class: className = "", onclick, children, ...restProps }) {
    const baseClasses = "flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95";

    // Make className reactive
    const spacingClass = isLast ? "" : "mb-0.5";
    const activeClass = isActive ? "current-theme-btn" : "";
    const allClasses = `${baseClasses} ${spacingClass} ${activeClass} ${className}`.trim();

    return (
        <button
            class={allClasses}
            onclick={onclick}
            {...restProps}
        >
            {children}
        </button>
    );
}