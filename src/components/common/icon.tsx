/**
 * Preact Icon component - inline SVG at build time
 */
import { h } from 'preact';
import { getIconSvg, hasIcon } from "@utils/icons";

export default function Icon({ icon, class: className = "", style = "", size = "md", color }) {
    // Size mapping
    const sizeClasses = {
        xs: "text-xs",
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;
    const colorStyle = color ? `color: ${color};` : "";
    const combinedStyle = `${colorStyle}${style}`;
    const combinedClass = `${sizeClass} ${className}`.trim();

    // Get inline SVG
    const svgContent = getIconSvg(icon);
    const iconExists = hasIcon(icon);

    if (iconExists && svgContent) {
        return (
            <span
                class={`inline-icon inline-flex items-center justify-center ${combinedClass}`}
                style={combinedStyle}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        );
    } else {
        return (
            <span
                class={`inline-icon inline-flex items-center justify-center ${combinedClass}`}
                style={combinedStyle}
                aria-hidden="true"
                title={`Icon not found: ${icon}`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                </svg>
            </span>
        );
    }
}

<style tsx>{`
    .inline-icon :global(svg) {
        width: 1em;
        height: 1em;
        display: inline-block;
        vertical-align: middle;
        fill: currentColor;
    }
`}</style>