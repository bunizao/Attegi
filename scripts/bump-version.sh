#!/bin/bash

# Bump version script for Attegi theme
# Usage: ./scripts/bump-version.sh [major|minor|patch|version]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo -e "${GREEN}Current version: ${CURRENT_VERSION}${NC}"

# Parse version
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

# Determine new version
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: $0 [major|minor|patch|version]${NC}"
  echo "  major: Bump major version (X.0.0)"
  echo "  minor: Bump minor version (x.X.0)"
  echo "  patch: Bump patch version (x.x.X)"
  echo "  version: Specify exact version (e.g., 1.2.3)"
  exit 1
fi

case "$1" in
  major)
    NEW_VERSION="$((MAJOR + 1)).0.0"
    ;;
  minor)
    NEW_VERSION="${MAJOR}.$((MINOR + 1)).0"
    ;;
  patch)
    NEW_VERSION="${MAJOR}.${MINOR}.$((PATCH + 1))"
    ;;
  *)
    NEW_VERSION="$1"
    ;;
esac

echo -e "${GREEN}New version: ${NEW_VERSION}${NC}"

# Confirm
read -p "Update version to ${NEW_VERSION}? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Aborted${NC}"
  exit 1
fi

# Update package.json
echo "Updating package.json..."
node -e "
const fs = require('fs');
const pkg = require('./package.json');
pkg.version = '${NEW_VERSION}';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo -e "${GREEN}✓ Version updated to ${NEW_VERSION}${NC}"
echo ""
echo "Next steps:"
echo "  1. Review changes: git diff package.json"
echo "  2. Commit: git add package.json && git commit -m 'chore: bump version to ${NEW_VERSION}'"
echo "  3. Push: git push"
echo "  4. Create release: Go to GitHub Actions → Create Release → Run workflow"
