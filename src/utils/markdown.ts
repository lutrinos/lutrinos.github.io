/**
 * Markdown interaction logic
 * Includes code block copy and collapse functionality
 * Uses event delegation to ensure it works after Swup navigation
 */

export function initMarkdownActions() {
    if (typeof document === "undefined") return;
    // Remove old event listeners (if any) to prevent duplicate bindings
    // Note: Since anonymous functions are used and typically run only once on page load, in Swup environment, if this script is loaded in the main layout, it will only run once.
    document.addEventListener("click", function (e: MouseEvent) {
        const target = e.target as Element | null;
        if (!target) return;

        // 1. Handle copy button click
        if (target.classList.contains("copy-btn") || target.closest(".copy-btn")) {
            const btn = target.classList.contains("copy-btn") ? target : target.closest(".copy-btn");
            if (!btn) return;
            
            const codeEle = btn.parentElement?.querySelector("code");

            // Precise code extraction logic
            let code = '';
            if (codeEle) {
                // Get all code line elements
                const lineElements = codeEle.querySelectorAll('span.line');
                // For code blocks with line structure, handle each line precisely
                if (lineElements.length > 0) {
                    const lines: string[] = [];
                    for (let i = 0; i < lineElements.length; i++) {
                        const lineElement = lineElements[i];
                        const lineText = lineElement.textContent || '';
                        lines.push(lineText);
                    }
                    code = lines.join('\n');
                } else {
                    const codeElements = codeEle.querySelectorAll('.code:not(summary *)');
                    if (codeElements.length > 0) {
                        const lines: string[] = [];
                        for (let i = 0; i < codeElements.length; i++) {
                            const el = codeElements[i];
                            const lineText = el.textContent || '';
                            lines.push(lineText);
                        }
                        code = lines.join('\n');
                    } else {
                        code = codeEle.textContent || '';
                    }
                }
            }

            // Handle consecutive empty lines
            code = code.replace(/\n\n\n+/g, function(match) {
                const newlineCount = match.length;
                const emptyLineCount = newlineCount - 1;
                let resultEmptyLines: number;
                if (emptyLineCount % 2 === 0) {
                    resultEmptyLines = emptyLineCount / 2;
                } else {
                    resultEmptyLines = Math.floor((emptyLineCount + 1) / 2);
                }
                if (resultEmptyLines < 1) resultEmptyLines = 1;
                return '\n'.repeat(resultEmptyLines + 1);
            });

            // Try multiple copy methods
            const copyToClipboard = async (text: string) => {
                try {
                    await navigator.clipboard.writeText(text);
                } catch (clipboardErr) {
                    console.warn('Clipboard API failed, trying fallback plan:', clipboardErr);
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.left = '-999999px';
                    textArea.style.top = '-999999px';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                    } catch (execErr) {
                        console.error('execCommand also failed:', execErr);
                        throw new Error('All copy methods failed');
                    } finally {
                        document.body.removeChild(textArea);
                    }
                }
            };

            // Call copy function
            copyToClipboard(code).then(() => {
                const timeoutId = btn.getAttribute("data-timeout-id");
                if (timeoutId) {
                    clearTimeout(parseInt(timeoutId));
                }
                btn.classList.add("success");
                const newTimeoutId = setTimeout(() => {
                    btn.classList.remove("success");
                }, 1000);
                btn.setAttribute("data-timeout-id", newTimeoutId.toString());
            }).catch(err => {
                console.error('复制失败:', err);
            });
        }

        // 2. Handle collapse button click
        if (target.classList.contains("collapse-btn") || target.closest(".collapse-btn")) {
            const btn = target.classList.contains("collapse-btn") ? target : target.closest(".collapse-btn");
            const codeBlock = btn?.closest(".expressive-code");
            if (codeBlock) {
                codeBlock.classList.toggle("collapsed");
                codeBlock.classList.toggle("expanded");
            }
        }
    });
}
