#!/bin/bash

echo "🔍 Checking deployment conditions..."
echo "Branch: $VERCEL_GIT_COMMIT_REF"

# Only deploy main if this is a merge commit (indicating PR was merged after tests passed)
# or if you're okay with running tests here
if [[ "$VERCEL_GIT_COMMIT_REF" == "main" ]]; then
  echo "📋 Main branch detected. Running tests..."
  pnpm install --frozen-lockfile
  pnpm test:ci

  if [ $? -eq 0 ]; then
    echo "✅ Tests passed! Deploying to production."
    exit 1  # Proceed with build
  else
    echo "❌ Tests failed! Skipping deployment."
    exit 0  # Skip build
  fi
else
  echo "🚀 Preview branch, deploying without running tests."
  exit 1  # Always deploy preview branches
fi
