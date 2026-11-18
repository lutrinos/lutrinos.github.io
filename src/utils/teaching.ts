
// Importer les utilitaires
import { join, relative, basename } from "node:path";
import { stat, readdir } from "node:fs/promises";

export type Item = {
    isDirectory: boolean;
    size: number;
    path: string;
    fullPath: string;
    basename: string;
    date: Date;
    children: Item[];
};

// Générer les chemins statiques à partir des fichiers
export async function computeStaticPaths() {

    const TEACHING_DIR = join(process.cwd(), "src/content/teaching");

    // On liste récursivement tous les fichiers et dossiers
    async function listAllFiles(dir: string, arr: Item[]): Promise<Item[]> {
        const entries = await readdir(dir, { withFileTypes: true });
        const files = [];

        for (const entry of entries) {
            const fullPath = join(dir, entry.name);
            const stats = await stat(fullPath);

            const item: Item = {
                isDirectory: stats.isDirectory(),
                size: stats.size,
                path: relative(TEACHING_DIR, fullPath),
                fullPath: fullPath,
                basename: basename(entry.name),
                date: new Date(stats.mtime),
                children: [],
            };

            if (entry.isDirectory()) {
                const subitems = await listAllFiles(fullPath, item.children);
                // item.children = subitems
                //   .filter((item) => item.path.startsWith(dir));

                files.push(...subitems);
            }

            item.children.sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) {
                    return -1;
                }

                if (!a.isDirectory && b.isDirectory) {
                    return 1;
                }

                console.log(a.basename, b.basename, a.basename.localeCompare(b.basename));
                return a.basename.localeCompare(b.basename);
            });

            files.push(item);
            arr.push(item);
        }

        return files;
    }

    const root: Item = {
        isDirectory: true,
        path: "",
        fullPath: TEACHING_DIR,
        size: 0,
        basename: "Enseignement",
        children: [],
        date: new Date(),
    };

    const files = await listAllFiles(TEACHING_DIR, root.children);
    files.push(root);

    return files.map((item: any) => ({
        params: {
            path: item.path,
        },
        props: item,
    }));
}
