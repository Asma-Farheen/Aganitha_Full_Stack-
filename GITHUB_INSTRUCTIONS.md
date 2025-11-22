# How to Push to GitHub

1.  **Create a New Repository** on GitHub (e.g., named `tinylink`).
2.  **Do NOT** initialize it with a README, .gitignore, or License (we already have them).
3.  **Run these commands** in your terminal (VS Code terminal is fine):

```bash
# Initialize git if not already done (it likely is)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial submission: TinyLink full stack app"

# Rename branch to main
git branch -M main

# Link to your new GitHub repo (replace URL with your actual repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/tinylink.git

# Push the code
git push -u origin main
```

## Deployment (Optional)

If you decide to deploy later:
1.  Push to GitHub.
2.  Go to Vercel.com -> "Add New Project".
3.  Import your `tinylink` repo.
4.  Add your `DATABASE_URL` to the Vercel Environment Variables.
5.  Click "Deploy".
