---
name: code-review
description: Review code changes for quality, correctness and alignment.
---

# Code Review

When reviewing changes, only review the files related to the curent context - don't just review everything that's changed as there may be unrelated modifications to the working tree.

**Arguments:** $ARGUMENTS

## Instructions

1. Determine what to review. Consider what is relevant to our current session. Create a description of this to pass to the subagents so that they know what to review, and the context of the review.
2. Launch **all four reviewer agents in parallel** using the Task tool:

| Agent                 | subagent_type         | Task                                        |
| --------------------- | --------------------- | ------------------------------------------- |
| reviewer-design       | reviewer-design       | Review these changes for design consistency |
| reviewer-code-quality | reviewer-code-quality | Review these changes for code quality       |
| reviewer-testing      | reviewer-testing      | Review test coverage for these changes      |
| reviewer-product      | reviewer-product      | Review product alignment for these changes  |

For each agent, include the description of what to review, and a note that they should ONLY review what you've indicated.

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
