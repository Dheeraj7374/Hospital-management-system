---
description: Steps to push the project to a GitHub repository
---

# How to Push Code to GitHub

Follow these steps to push your code to a new GitHub repository.

## 1. Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Enter a **Repository name** (e.g., `hospital-management-system`).
3. Choose **Public** or **Private**.
4. **Do not** check "Initialize this repository with a README" (since you already have code).
5. Click **Create repository**.

## 2. Initialize Git locally
Open your terminal (Command Prompt or PowerShell) in the project folder and run:

```bash
git init
```

## 3. Add Files
Stage all your files for the first commit:

```bash
git add .
```

## 4. Commit Changes
Save your changes with a message:

```bash
git commit -m "Initial commit"
```

## 5. Link to GitHub
Copy the URL of the repository you created in Step 1 (e.g., `https://github.com/username/repo-name.git`) and run:

```bash
git remote add origin <YOUR_REPO_URL>
```
*(Replace `<YOUR_REPO_URL>` with the actual link)*

## 6. Push to GitHub
Upload your code:

```bash
git branch -M main
git push -u origin main
```

---
**Note:** If you get an error about "remote origin already exists", run `git remote remove origin` and try Step 5 again.
