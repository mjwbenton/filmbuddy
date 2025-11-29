# Code Review

Review code changes from this session using specialized reviewer agents.

## Instructions

1. Run `git status` to see all modified files in the working directory
2. Review the conversation history to identify files related to this session:
   - Files Claude directly created or edited
   - Files the user modified as part of this task
   - Files changed by running code/commands during this session
   - Exclude files that appear unrelated to the work done in this chat
3. Run `git diff` on only those session-related files to get the actual changes
4. Launch **all four reviewer agents in parallel** using the Task tool:

| Agent                 | subagent_type         | Task                                        |
| --------------------- | --------------------- | ------------------------------------------- |
| reviewer-design       | reviewer-design       | Review these changes for design consistency |
| reviewer-code-quality | reviewer-code-quality | Review these changes for code quality       |
| reviewer-testing      | reviewer-testing      | Review test coverage for these changes      |
| reviewer-product      | reviewer-product      | Review product alignment for these changes  |

For each agent, include:

- The list of files related to this session
- The diff output for those files
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
