# Release Process

This document describes how to create a new release for the Attegi theme.

## Automated Release Workflow

The theme uses GitHub Actions to automate the release process.

### Method 1: Manual Release (Recommended)

1. **Update version in package.json**
   ```bash
   # Bump patch version (6.6.5 → 6.6.6)
   ./scripts/bump-version.sh patch

   # Bump minor version (6.6.5 → 6.7.0)
   ./scripts/bump-version.sh minor

   # Bump major version (6.6.5 → 7.0.0)
   ./scripts/bump-version.sh major

   # Or specify exact version
   ./scripts/bump-version.sh 6.7.0
   ```

2. **Commit and push**
   ```bash
   git add package.json
   git commit -m "chore: bump version to 6.7.0"
   git push
   ```

3. **Create release via GitHub Actions**
   - Go to [Actions → Create Release](../../actions/workflows/release.yml)
   - Click "Run workflow"
   - Leave version empty to use package.json version
   - Or enter a specific version
   - Click "Run workflow"

4. **The workflow will automatically:**
   - ✅ Build and package the theme
   - ✅ Validate with GScan
   - ✅ Create a git tag (e.g., v6.7.0)
   - ✅ Create a GitHub release
   - ✅ Attach the theme zip file
   - ✅ Generate release notes

### Method 2: Tag-based Release

1. **Create and push a tag**
   ```bash
   git tag -a v6.7.0 -m "Release v6.7.0"
   git push origin v6.7.0
   ```

2. **The build workflow will automatically:**
   - Trigger on the new tag
   - Build and package the theme
   - Create a GitHub release
   - Attach the theme zip file

## Release Checklist

Before creating a release, ensure:

- [ ] All changes are committed and pushed
- [ ] Version number is updated in `package.json`
- [ ] Theme passes `npx gscan .` validation
- [ ] Theme has been tested locally
- [ ] README.md is up to date
- [ ] CHANGELOG or commit messages are clear

## What Gets Included in the Release

The release package (`attegi.zip`) includes:

✅ **Included:**
- All `.hbs` template files
- Compiled CSS and JS (`assets/`)
- Font files
- Theme images
- 32 language files (`locales/`)
- `package.json`
- `LICENSE`
- `README.md`

❌ **Excluded:**
- Source files (`src/`)
- Screenshots (`screenshots/`)
- Development files (`.github/`, `Gruntfile.js`, etc.)
- Node modules
- Git files

## Release Information

Each release automatically includes:

- **Theme name and version** (from package.json)
- **Description** (from package.json)
- **Installation instructions**
- **Links** (demo, documentation)
- **Feature list**
- **Package info** (size, Ghost version, validation status)
- **Changelog** (auto-generated from commits)

## Troubleshooting

### Tag already exists
If you see "Tag already exists", either:
- Delete the existing tag: `git tag -d v6.7.0 && git push origin :refs/tags/v6.7.0`
- Use a different version number

### Build fails
- Check the [Actions tab](../../actions) for error details
- Ensure all dependencies are in `package.json`
- Verify GScan passes locally: `npx gscan .`

### Release not created
- Ensure you have write permissions to the repository
- Check that the workflow has `contents: write` permission
- Verify the tag was pushed: `git ls-remote --tags origin`

## Manual Release (Fallback)

If automated release fails, you can create a release manually:

1. **Build locally**
   ```bash
   npx grunt clean:dist
   npx grunt build
   npx grunt compress
   ```

2. **Validate**
   ```bash
   npx gscan -z dist/attegi.zip
   ```

3. **Create release on GitHub**
   - Go to [Releases](../../releases)
   - Click "Draft a new release"
   - Create a new tag (e.g., v6.7.0)
   - Upload `dist/attegi.zip`
   - Fill in release notes
   - Publish release
