// Optional: Access control for GitHub usernames
// Add allowed GitHub usernames here (in lowercase)
const allowedGitHubUsernames = new Set<string>([
  // Example usernames - replace with your actual allowed users
  // "octocat",
  // "github",
]);

export function isAllowedGitHubUsername(username: string): boolean {
  if (!username || typeof username !== 'string') {
    return false;
  }

  // If no usernames are configured, allow all authenticated users
  if (allowedGitHubUsernames.size === 0) {
    return true;
  }

  return allowedGitHubUsernames.has(username.toLowerCase());
}
