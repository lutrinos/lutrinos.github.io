/**
 * Common dropdown panel component (Preact version)
 * Used for dropdown panels like wallpaper switch, light/dark switch, etc.
 */
import { h } from 'preact';

export default function DropdownPanel({ id, class: className = "", children, ...restProps }) {
    return (
        <div id={id} class={`card-base float-panel p-2 ${className}`.trim()} {...restProps}>
            {children}
        </div>
    );
}