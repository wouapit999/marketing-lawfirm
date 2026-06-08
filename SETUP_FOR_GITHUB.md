# GitHub Setup Instructions

This guide walks you through setting up the LawFirm Marketing Hub project on GitHub with the account **wouapit999**.

## Prerequisites

- GitHub account (wouapit999)
- Git installed locally
- SSH key configured with GitHub (recommended)

## Step 1: Create Repository on GitHub

1. **Go to GitHub**: https://github.com/nouapit999
2. **Click "New"** (top left or in repositories tab)
3. **Repository name**: `marketing-lawfirm` or `lawfirm-marketing`
4. **Description**: "AI-powered marketing automation platform for law firms with multi-platform publishing, metrics tracking, and Claude Opus content generation"
5. **Visibility**: Choose Public or Private
6. **Initialize**: DO NOT check "Add a README" (we already have one)
7. **Click "Create repository"**

## Step 2: Initialize Local Git Repository

Open terminal/PowerShell in the project root (`C:\Users\wouap\lawfirm-hub`):

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "feat: initial commit - LawFirm Marketing Hub with Layer 5 AI content generation"

# Rename branch to main (if not already)
git branch -M main
```

## Step 3: Add Remote and Push

```bash
# Add remote (replace YOUR-REPO-NAME with actual repo name)
git remote add origin https://github.com/wouapit999/marketing-lawfirm.git

# Or use SSH (if configured):
# git remote add origin git@github.com:wouapit999/marketing-lawfirm.git

# Push to GitHub
git push -u origin main

# Verify
git remote -v
```

Expected output:
```
origin  https://github.com/wouapit999/marketing-lawfirm.git (fetch)
origin  https://github.com/wouapit999/marketing-lawfirm.git (push)
```

## Step 4: Verify on GitHub

1. **Go to**: https://github.com/wouapit999/marketing-lawfirm
2. **Verify**:
   - All files are visible
   - Commits show in history
   - Branch protection rules (optional)
   - GitHub Actions workflows appear

## Step 5: Configure GitHub Settings (Optional)

### Enable GitHub Actions
1. Go to **Settings** → **Actions** → **General**
2. Ensure "Actions permissions" is set to "Allow all actions"
3. Workflows under `.github/workflows/` will auto-run on push/PR

### Add Branch Protection (Recommended for Production)
1. Go to **Settings** → **Branches**
2. Click **Add rule**
3. **Branch name pattern**: `main`
4. Enable:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date before merging
5. **Save changes**

### Set Default Branch
1. Go to **Settings** → **Default branch**
2. Select `main`
3. Save

## Step 6: Configure Project Settings

### General
1. **Settings** → **General**
2. Features:
   - ☑️ Discussions (for Q&A)
   - ☑️ Wiki (for documentation)
   - ☑️ Projects (for planning)

### Secrets (For CI/CD)
1. **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key
3. Add other secrets as needed:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `JWT_SECRET`

## File Structure After Git Init

```
marketing-lawfirm/
├── .git/                          (git history - auto created)
├── .github/
│   ├── workflows/
│   │   └── ci.yml                 (CI/CD pipeline)
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
├── backend/
│   ├── src/
│   │   ├── ai/                    (Layer 5)
│   │   ├── auth/                  (Layer 1)
│   │   └── ...
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── app/
│   │   ├── hooks/
│   │   └── ...
│   └── package.json
├── .gitignore                     (files to ignore)
├── LICENSE                        (MIT License)
├── README.md                      (main documentation)
├── CONTRIBUTING.md                (contributor guide)
├── QUICKSTART.md                  (quick start guide)
├── LAYER5_INTEGRATION_GUIDE.md   (integration details)
├── LAYER5_TESTING_GUIDE.md       (testing guide)
├── LAYER5_COMPLETION_SUMMARY.md  (what was built)
├── LAYER5_FILES_MANIFEST.md      (file index)
└── SETUP_FOR_GITHUB.md            (this file)
```

## Common Git Commands

### For Contributors

```bash
# Clone the repository
git clone https://github.com/wouapit999/marketing-lawfirm.git

# Create feature branch
git checkout -b feature/your-feature

# Stage changes
git add .

# Commit
git commit -m "feat: describe your feature"

# Push to fork
git push origin feature/your-feature

# Create Pull Request on GitHub
```

### For Maintenance

```bash
# Check status
git status

# View logs
git log --oneline

# Create tags
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Create release from tag
# On GitHub: Releases → Draft a new release → Select tag
```

## GitHub Pages (Optional Documentation)

To enable GitHub Pages for documentation:

1. **Settings** → **Pages**
2. **Source**: Deploy from branch
3. **Branch**: main / (root)
4. **Save**

Then access at: `https://wouapit999.github.io/marketing-lawfirm`

## Managing Issues and Pull Requests

### Labels
GitHub automatically creates default labels:
- `bug` - Bug reports
- `enhancement` - Feature requests
- `documentation` - Doc updates
- `good first issue` - For new contributors

### Templates
Issue/PR templates auto-populate when users create new issues/PRs:
- **Bug Report**: `.github/ISSUE_TEMPLATE/bug_report.md`
- **Feature Request**: `.github/ISSUE_TEMPLATE/feature_request.md`
- **Pull Request**: `.github/pull_request_template.md`

## CI/CD Pipeline

GitHub Actions will automatically:
1. **On Push to main/develop**:
   - Run linting
   - Build backend and frontend
   - Run tests
   - Build Docker images
   - Deploy to staging (if configured)

2. **On Pull Request**:
   - Run all checks
   - Report status
   - Block merge if checks fail

View workflow results: **Actions** tab on GitHub

## Repository Badges (Optional)

Add to README.md:

```markdown
[![CI/CD](https://github.com/wouapit999/marketing-lawfirm/actions/workflows/ci.yml/badge.svg)](https://github.com/wouapit999/marketing-lawfirm/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
```

## Troubleshooting

### "fatal: 'origin' does not appear to be a 'git' repository"
```bash
# Re-add remote
git remote add origin https://github.com/wouapit999/marketing-lawfirm.git
```

### "Permission denied (publickey)"
- Ensure SSH key is added to GitHub
- Or use HTTPS instead: `https://github.com/wouapit999/marketing-lawfirm.git`

### "Updates were rejected because the tip of your current branch is behind"
```bash
# Pull latest changes
git pull origin main

# Then push again
git push origin main
```

### "Everything up-to-date" but files missing
- Verify `.gitignore` isn't hiding files
- Check `git status`
- Manually add if needed: `git add -f filename`

## Next Steps

After setting up GitHub:

1. ✅ Repository created
2. ✅ Code pushed to GitHub
3. ✅ CI/CD pipeline running
4. ✅ Documentation in place
5. ⏭️ **Invite collaborators** (Settings → Collaborators)
6. ⏭️ **Enable discussions** (Settings → General → Discussions)
7. ⏭️ **Create project board** (Projects tab)
8. ⏭️ **Set up GitHub Pages** (for docs)

## Resources

- **GitHub Docs**: https://docs.github.com
- **Git Documentation**: https://git-scm.com/doc
- **GitHub Actions**: https://docs.github.com/en/actions
- **GitHub CLI**: https://cli.github.com/

## Support

For GitHub-specific issues:
1. Check GitHub help: https://support.github.com
2. Review GitHub documentation
3. Contact GitHub support if needed

---

**Repository**: https://github.com/wouapit999/marketing-lawfirm
**Account**: wouapit999
**License**: MIT

Ready to collaborate! 🚀
