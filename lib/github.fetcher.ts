import { Octokit } from "octokit";
import { throttling } from "@octokit/plugin-throttling";
import "dotenv/config";

const MyOctokit = Octokit.plugin(throttling);

const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
  throttle: {
    onRateLimit: (retryAfter: number, options: any, octokit: any, retryCount: number) => {
      octokit.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (retryCount < 1) {
        // only retries once
        octokit.log.info(`Retrying after ${retryAfter} seconds!`);
        return true;
      }
    },
    onSecondaryRateLimit: (retryAfter: number, options: any, octokit: any) => {
      // does not retry, only logs a warning
      octokit.log.warn(
        `SecondaryRateLimit detected for request ${options.method} ${options.url}`
      );
    },
  },
});

export async function getRepoInfo(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });
    return data;
  } catch (error) {
    console.error(`Failed to fetch repo info for ${owner}/${repo}`, error);
    return null;
  }
}

export async function getReleases(owner: string, repo: string) {
  try {
    const { data } = await octokit.rest.repos.listReleases({ owner, repo, per_page: 100 });
    return data;
  } catch (error) {
    console.error(`Failed to fetch releases for ${owner}/${repo}`, error);
    return [];
  }
}

export async function getCommitsInRange(owner: string, repo: string, since: string, until: string) {
  try {
    const { data } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      since,
      until,
      per_page: 100,
    });
    return data;
  } catch (error) {
    console.error(`Failed to fetch commits for ${owner}/${repo}`, error);
    return [];
  }
}

export async function getIssuesAndPRs(owner: string, repo: string) {
  try {
    const [issues, pulls] = await Promise.all([
      octokit.rest.issues.listForRepo({ owner, repo, state: "open", per_page: 100 }),
      octokit.rest.pulls.list({ owner, repo, state: "open", per_page: 100 }),
    ]);
    return {
      issues: issues.data,
      pulls: pulls.data,
    };
  } catch (error) {
    console.error(`Failed to fetch issues/PRs for ${owner}/${repo}`, error);
    return { issues: [], pulls: [] };
  }
}
