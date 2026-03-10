import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import { drafts } from "@/lib/constants";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
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
}: {
  per_page?: number;
  page?: number;
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

    const response = await octokit.request("GET /search/repositories", {
      q: "topic:json-schema",
      sort: "stars",
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

export async function getDraftAdoption() {
  try {
    const results = await Promise.all(
      drafts.map(async (draft) => {
        const response = await octokit.request("GET /search/code", {
          q: draft.query,
          per_page: 1,
        });
        return {
          draft: draft.name,
          count: response.data.total_count,
          url: draft.query,
        };
      }),
    );
    return results;
  } catch (error) {
    console.error("Failed to fetch draft adoption", error);
    return [];
  }
}
