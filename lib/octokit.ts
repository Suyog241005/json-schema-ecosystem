import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { drafts } from "@/lib/constants";
import { throttling } from "@octokit/plugin-throttling";
import "dotenv/config";

/**
 * Configure a custom Octokit instance with the throttling plugin.
 * This is essential for managing GitHub's secondary rate limits,
 * especially when performing automated searches.
 */
const MyOctokit = Octokit.plugin(throttling);

export const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter: number, options: any, octokit: any, retryCount: number) => {
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`,
      );

      if (retryCount < 2) {
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (retryAfter: number, options: any, octokit: any) => {
      octokit.log.warn(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`,
      );
      // Retry for secondary rate limits as well
      return true;
    },
  },
});

export type SearchRepositoriesResponse =
  Endpoints["GET /search/repositories"]["response"]["data"];

export type RepoItem = SearchRepositoriesResponse["items"][number];

export interface PaginatedReposResponse {
  items: RepoItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  perPage: number;
}

export async function paginatedRepos({
  per_page = 21,
  page = 1,
  q = "",
  sort = "stars",
}: {
  per_page?: number;
  page?: number;
  q?: string;
  sort?: string;
}): Promise<PaginatedReposResponse | null> {
  try {
    // GitHub API limitation: max 1000 results
    const maxResultCount = 1000;
    const maxPage = Math.ceil(maxResultCount / per_page);

    if (page > maxPage) {
      console.warn(
        `GitHub API limitation: Cannot fetch page ${page}. Maximum page is ${maxPage} (${maxResultCount} results total)`,
      );
      return null;
    }

    const query = `topic:json-schema ${q}`;

    const response = await octokit.request("GET /search/repositories", {
      q: query,
      sort: sort as any,
      order: "desc",
      per_page,
      page,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });


    const totalCount = response.data.total_count;

    // Fix: Calculate totalPages based on the 1000 limit, not full count
    const accessibleCount = Math.min(totalCount, maxResultCount);
    const totalPages = Math.ceil(accessibleCount / per_page);

    return {
      items: response.data.items,
      totalCount,
      currentPage: page,
      totalPages,
      perPage: per_page,
    };
  } catch (error) {
    console.error("Failed to fetch github repos", error);
    return null;
  }
}

/**
 * Fetches the adoption count for each JSON Schema draft.
 * Uses sequential requests with a 5-second delay to avoid triggering 
 * GitHub's secondary rate limits for code search. 
 * Note: Code search is much more restrictive than repository search.
 */
export async function getDraftAdoption() {
  try {
    const results = [];
    
    for (const draft of drafts) {
      // Add a 5-second delay between search requests to stay within conservative anti-abuse limits
      if (results.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      const response = await octokit.request("GET /search/code", {
        q: draft.query,
        per_page: 1,
      });

      results.push({
        draft: draft.name,
        count: response.data.total_count,
        url: draft.query,
      });
    }

    return results;
  } catch (error) {
    console.error("Failed to fetch draft adoption", error);
    return [];
  }
}
