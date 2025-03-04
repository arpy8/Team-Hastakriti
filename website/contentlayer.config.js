import { defineDocumentType } from "@contentlayer/source-files";
import { makeSource } from "@contentlayer/source-remote-files";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs/promises";
import * as path from "node:path";

// Import remark and rehype plugins
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

const execAsync = promisify(exec);

const syncContentFromGit = async (contentDir) => {
  const syncRun = async () => {
    const gitUrl = "https://github.com/cloak233/hastakriti-docs.git";

    // Ensure the content directory exists
    try {
      await fs.mkdir(contentDir, { recursive: true });
    } catch (error) {
      console.log("Directory already exists or cannot be created:", error);
    }

    const sync = async () => {
      try {
        // Check if it's already a git repository
        const isGitRepo = await fs
          .access(path.join(contentDir, ".git"))
          .then(() => true)
          .catch(() => false);

        if (isGitRepo) {
          // If exists, pull latest changes
          console.log("Pulling latest changes...");
          await execAsync("git pull", {
            cwd: contentDir,
            shell: true,
          });
        } else {
          // If not exists, clone the repo
          console.log("Cloning repository...");
          await execAsync(`git clone ${gitUrl} .`, {
            cwd: contentDir,
            shell: true,
          });
        }
      } catch (error) {
        console.error("Git operation failed:", error);
      }
    };

    await sync();
  };

  let wasCancelled = false;
  let syncInterval;

  const syncLoop = async () => {
    await syncRun();

    if (wasCancelled) return;

    // Sync every 5 minutes
    syncInterval = setTimeout(syncLoop, 1000 * 40);
  };

  await syncLoop();

  return () => {
    wasCancelled = true;
    clearTimeout(syncInterval);
  };
};

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  path: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "projects/**/*.mdx",
  contentType: "mdx",

  fields: {
    published: {
      type: "boolean",
    },
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      required: true,
    },
    date: {
      type: "date",
    },
    url: {
      type: "string",
    },
    repository: {
      type: "string",
    },
  },
  computedFields,
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
  },
  computedFields,
}));

// const syncContentFromGit = async (contentDir) => {
//   const syncRun = async () => {
//     const gitUrl = "https://github.com/cloak233/hastakriti-docs.git"; // e.g. 'https://github.com/username/content-repo.git'

//     const sync = async () => {
//       try {
//         // Check if repo already exists
//         await spawn("git", ["status"], { cwd: contentDir });

//         // If exists, pull latest changes
//         await spawn("git", ["pull"], { cwd: contentDir });
//       } catch {
//         // If not exists, clone the repo
//         await spawn("git", ["clone", gitUrl, contentDir]);
//       }
//     };

//     await sync();
//   };

//   let wasCancelled = false;
//   let syncInterval;

//   const syncLoop = async () => {
//     await syncRun();

//     if (wasCancelled) return;

//     // Sync every 5 minutes
//     syncInterval = setTimeout(syncLoop, 1000 * 60 * 5);
//   };

//   await syncLoop();

//   return () => {
//     wasCancelled = true;
//     clearTimeout(syncInterval);
//   };
// };

console.log("Plugins loaded:", {
  remarkGfm: !!remarkGfm,
  rehypePrettyCode: !!rehypePrettyCode,
  rehypeSlug: !!rehypeSlug,
  rehypeAutolinkHeadings: !!rehypeAutolinkHeadings,
});

export default makeSource({
  syncFiles: syncContentFromGit,
  contentDirPath: "content-repo",
  documentTypes: [Page, Project],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: "github-dark",
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }];
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted");
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"];
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
