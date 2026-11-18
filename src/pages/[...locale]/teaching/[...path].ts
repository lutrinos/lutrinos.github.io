export const prerender = true;

import type { APIRoute } from "astro";
import { lookup } from "mrmime";
import { computeStaticPaths } from "../../../utils/teaching";

// Importer les modules Node.js
const fs = await import("node:fs/promises");

type Item = {
  isDirectory: boolean;
  size: number;
  path: string;
  fullPath: string;
  basename: string;
  date: Date;
  children: Item[];
};

// Générer les chemins statiques à partir des fichiers
export async function getStaticPaths() {
  const files = await computeStaticPaths();

  return files.filter((item) => !(item.props as Item).isDirectory)
}

export const GET: APIRoute = async ({ props }) => {
  const item = props;
  const fileBuffer = await fs.readFile(item.fullPath);

  return new Response(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': lookup(item.basename) || 'application/octet-stream',
    },
  });
};