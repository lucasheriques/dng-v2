#!/bin/bash

echo "🔍 Checking if deployment should proceed..."
echo "Branch: $VERCEL_GIT_COMMIT_REF"
echo "Commit: $VERCEL_GIT_COMMIT_SHA"

# For main branch, run tests before deploying
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  echo "📋 Running tests for main branch..."

  # Install dependencies and run tests
  pnpm install --frozen-lockfile
  pnpm test:ci

  # Check if tests passed
  if [ $? -eq 0 ]; then
    echo "✅ Tests passed! Proceeding with deployment."
    exit 1  # Exit 1 means "proceed with build"
  else
    echo "❌ Tests failed! Skipping deployment."
    exit 0  # Exit 0 means "skip build"
  fi
else
  echo "🚀 Non-main branch, proceeding with deployment."
  exit 1  # Always deploy preview branches
fi
