# ExpressJs-Best-Practices-Boilerplate

## Introduction
ExpressJs-Best-Practices-Boilerplate is a boilerplate for building ExpressJs applications with basic user CRUD and login/logout functionality. It uses the Express framework and MongoDB for database storage.


## Prerequisites
- Node.js version v20.10.0
- Git
- MongoDB
- Postman

## Installation
1. **Initialization command:**
   ```bash
   npx bootstrap-express-app my-app
   cd my-app
   ```
2. **Create Environment File:** </br>
   Create a .env file in the root directory of project and set the required environment variables. Refer to the provided .env.local for reference.

3. **Start Project:** </br>
   ```bash
   npm start
   ```
4. **Import Postman Collection:** </br>
- Find the Postman collection in the "postman collection doc" folder.
- Import Postman collection JSON file from postman
## Usage
### Development Environment:
To start the server in the local environment
   ```bash
   npm run dev
   ```
### Production Environment: 
To start the server in the production environment
   ```bash
   npm run prod
   ```
<ul>
<li>

### Monitoring Logs: 
To watch logs in the production environment
   ```bash
   pm2 logs
   ```
</li>
<li>

### Reloading Instances: 
To reload all instances of the production environment
   ```bash
   npm run prod-reload
   ```
</li>
<li>

### Stopping Instances: 
To stop all instances of the production environment
   ```bash
   npm run prod-stop
   ```
</li>
</ul>

## Git Best Practices

### Commit Standards

- **Atomic Commits**: Each commit should represent a single logical change. Avoid combining unrelated changes in a single commit.
  
- **Meaningful Commit Messages**: Write clear and concise commit messages that describe the purpose of the change. Follow the imperative mood (e.g., "Add feature" instead of "Added feature").

- **Commit Types**: Commit type must be following one:
   - feat: A new feature
   - fix: A bug fix
   - style: Changes that doesn't affect meaning of code(semi-colon, indentation, etc)
   - perf: Improve performance
   - refactor: Refactor code
   - test: Add missing test cases
   - docs: Documentation only change
   - chore: Change in auxiliary tools like documentation or seed change

- **Reference Issues**: If your commit is related to a specific issue or task, reference it in the commit message. For example, `fix: #123` or `feat: #456`. Here **#123** or **#456** are ticket Id.


### Branch Name Standards

- **Use Hyphens for Branch Names**: Use hyphens to separate words in branch names. For example, use `feature-branch` instead of `feature_branch` or `featureBranch`.

- **Prefix Branch Names**: Prefix branch names with a category or type. For example:
  - `feature/` for feature branches
  - `fix/` for fix branches

# Thank you 😊