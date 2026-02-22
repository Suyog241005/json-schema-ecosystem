import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function searchCode() {
  try {
    const response = await octokit.request("GET /search/repositories", {
      q: "topic:json-schema",
      sort: "stars",
      order: "desc",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}
