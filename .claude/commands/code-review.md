# Code Review

Review code changes for specified files, or files related to this chat session by default.

**Arguments:** $ARGUMENTS

## Instructions

1. Determine which files to review:
   - **If arguments are provided**: Interpret the arguments and find matching files in the codebase (could be file paths, patterns like `src/`, or descriptions like "the maestro tests"). Search the codebase to identify relevant files.
   - **If arguments are empty (default)**: Run `git status` and only include files related to this session:
     - Files Claude directly created or edited
     - Files the user modified as part of this task
     - Files changed by running code/commands during this session
     - Exclude files that appear unrelated to the work done in this chat
2. For each file identified, determine what to provide to reviewers:
   - **If file has uncommitted changes**: Use `git diff` to get the changes
   - **If file is committed (no pending changes)**: Read the full file contents for review
3. Launch **all four reviewer agents in parallel** using the Task tool:

| Agent                 | subagent_type         | Task                                        |
| --------------------- | --------------------- | ------------------------------------------- |
| reviewer-design       | reviewer-design       | Review these changes for design consistency |
| reviewer-code-quality | reviewer-code-quality | Review these changes for code quality       |
| reviewer-testing      | reviewer-testing      | Review test coverage for these changes      |
| reviewer-product      | reviewer-product      | Review product alignment for these changes  |

For each agent, include:

- The list of files to review
- The diff output (for uncommitted changes) or full file contents (for committed files)
- A note that they should ONLY review these files, ignoring other changes in the repo

## Output Format

After all agents complete, compile findings:

```
## Code Review Summary

### Design
[findings with file:line references]

### Code Quality
[findings with file:line references]

### Test Coverage
[missing tests]

### Product Alignment
[vision/plan concerns]

---
**Recommended Changes:**
1. [actionable items]

Would you like me to address any of these?
```

## Important

- Launch all 4 agents in a SINGLE message (parallel execution)
- Only report actual issues, not observations
- Be specific with file:line references
