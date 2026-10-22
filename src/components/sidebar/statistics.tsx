import { JSDOM } from "jsdom";

import { h } from 'preact';
import * as Plot from "@observablehq/plot";

const chartFontFamily =
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";

const colors = {
    category: '#f59e0b',
    tag: '#22c55e',
    axis: '#94a3b8',
    grid: '#e2e8f0',
    label: '#475569',
};

const buildLabelData = (items: any, limit = 5) =>
    items
        .filter((item: any) => !item.parent) // On ignore les sous-catégories
        .slice()
        .sort((a: any, b: any) => (b.count || 0) - (a.count || 0))
        .slice(0, limit)
        .map((item: any) => ({ label: item.name ?? item.label, value: item.count || 0 }));

const buildRadarChart = (data: any, color: string) => {
    if (data.length === 0) return "";

    const { document } = new JSDOM("").window;

    const maxValue = Math.max(...data.map((d: any) => Number(d.value) || 0), 1);
    const angleStep = (Math.PI * 2) / Math.max(data.length, 1);
    
    const points = data.map((d: any, i: number) => {
        const angle = i * angleStep - Math.PI / 2;
        return {
            x: Math.cos(angle) * (Number(d.value) || 0),
            y: Math.sin(angle) * (Number(d.value) || 0),
            x0: 0,
            y0: 0,
            ax: Math.cos(angle) * maxValue,
            ay: Math.sin(angle) * maxValue,
            label: d.label,
            angle
        };
    });

    return Plot.plot({
        document,
        width: 250,
        height: 250,
        style: { background: "none", fontFamily: chartFontFamily, fontSize: "10px", overflow: "visible" },
        x: { axis: null, domain: [-maxValue * 1.3, maxValue * 1.3] },
        y: { axis: null, domain: [-maxValue * 1.3, maxValue * 1.3] },
        marks: [
            // Anneaux de fond
            ...[0.25, 0.5, 0.75, 1].map(r =>
                Plot.line(points, {
                    x: d => Math.cos(d.angle) * r * maxValue,
                    y: d => Math.sin(d.angle) * r * maxValue,
                    stroke: colors.grid,
                    curve: "linear-closed",
                    strokeWidth: 0.5
                })
            ),
            // Axes rayonnants
            Plot.link(points, {
                x1: "x0", 
                y1: "y0",
                x2: "ax", 
                y2: "ay",
                stroke: colors.grid, strokeWidth: 0.5
            }),
            // Zone de données (remplacement de area par line + fill pour radar)
            Plot.line(points, { x: "x", y: "y", fill: color, fillOpacity: 0.1, stroke: color, strokeWidth: 2, curve: "linear-closed" }),
            Plot.dot(points, { x: "x", y: "y", fill: color, stroke: "white", r: 3.5 }),
            // Libellés
            Plot.text(points, {
                x: d => Math.cos(d.angle) * (maxValue * 1.2),
                y: d => Math.sin(d.angle) * (maxValue * 1.2),
                text: "label",
                fill: colors.label,
                textAnchor: (d) => {
                    const cos = Math.cos(d.angle);
                    return Math.abs(cos) < 0.1 ? "middle" : cos > 0 ? "start" : "end";
                }
            })
        ]
    }).outerHTML;
};


export default function Statistics({ categories = [], tags = [], class: className = '', style = '', side = 'default', labels = {} }) {
    const categoriesData = buildLabelData(categories, 5);
    const tagsData = buildLabelData(tags, 5);

    const categoryChart = buildRadarChart(categoriesData, colors.category);
    const tagChart = buildRadarChart(tagsData, colors.tag);

    const normalizedStyle = style ? `${style.trim().replace(/;?$/, ';')}` : '';
    const outerStyle = `${normalizedStyle}width:100%;`;

    return (
        <div data-swup-persist={`statistics-${side}`} id={`statistics-${side}`} class={`pb-4 card-base ${className}`} style={outerStyle}>
            <div class="font-bold transition text-lg text-neutral-900 dark:text-neutral-100 relative ml-8 mt-4 mb-2 before:w-1 before:h-4 before:rounded-md before:bg-(--primary) before:absolute before:left-[-16px] before:top-[5.5px]">{(labels as any).statistics}</div>

            <div class="px-4 overflow-hidden relative min-h-[180px]">
                <div class="stats-charts">
                    <div class="text-75 text-md font-extrabold">{(labels as any).categories}</div>
                    <div class="chart-section radar-section">
                        <div class="radar-container transition-opacity duration-600">
                            <div style="position: relative; overflow: hidden; width: 248px; height: 250px; cursor: default;">
                                <div dangerouslySetInnerHTML={{ __html: categoryChart }} />
                            </div>
                        </div>
                    </div>

                    <div class="text-75 text-md font-extrabold">{(labels as any).tags}</div>
                    <div class="chart-section radar-section">
                        <div class="radar-container transition-opacity duration-600">
                            <div style="position: relative; overflow: hidden; width: 248px; height: 250px; cursor: default;">
                                <div dangerouslySetInnerHTML={{ __html: tagChart }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
