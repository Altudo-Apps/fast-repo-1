# PR Description Generator Prompt

## Instructions

I want to create a comprehensive PR comment / description of the changes in the latest commits in the branch [BRANCH_NAME] with comparison to [BASE_BRANCH]. Ensure the output of the comment is in proper Markdown format.

## Required Git Commands

Use these commands to gather comprehensive information (use `--no-pager` to avoid interactive paging):

```bash
# Get commit history and messages
git log --no-pager --oneline [BASE_BRANCH]..[BRANCH_NAME]

# Get detailed diff of all changes
git diff --no-pager [BASE_BRANCH]..[BRANCH_NAME]

# Get list of changed files with stats
git diff --no-pager --stat [BASE_BRANCH]..[BRANCH_NAME]

# Get commit details with author info
git log --no-pager --pretty=format:"%h - %an, %ar: %s" [BASE_BRANCH]..[BRANCH_NAME]
```

## Output Requirements

Create a PR description with the following structure:

### 📋 Summary
Brief overview of the changes and their purpose.

### 🎯 Changes Made
Detailed list of modifications, organized by:
- **Added**: New features, files, or functionality
- **Modified**: Changes to existing code
- **Removed**: Deleted files or removed functionality
- **Fixed**: Bug fixes and issue resolutions

### 📁 Files Changed
List of modified files with brief description of changes in each.

### 🧪 Testing
- Description of how changes were tested
- Any new tests added
- Manual testing performed

### 📝 Notes
- Any breaking changes
- Migration steps if required
- Additional context for reviewers

### 🔗 Related Issues
Link to any related GitHub issues or tickets.

## Analysis Instructions

1. **Analyze commit messages** to understand the intent behind changes
2. **Review file diffs** to identify specific modifications
3. **Group related changes** into logical categories
4. **Identify patterns** in the changes (refactoring, feature addition, bug fixes)
5. **Note any significant architectural changes**
6. **Highlight potential impact** on other parts of the system

## Template Usage

Replace `[BRANCH_NAME]` and `[BASE_BRANCH]` with actual branch names:

```
# Example usage:
git log --no-pager --oneline main..feature/new-component
git diff --no-pager main..feature/new-component
```

## Output Format

The final output should be well-formatted Markdown suitable for copying directly into a GitHub PR description field.

Use appropriate emojis, bullet points, and code formatting to make the description clear and professional. 