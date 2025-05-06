# JS Toolkit Library

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

A modern JavaScript toolkit library built with [Nx](https://nx.dev) to provide reusable utilities for web applications.

## Packages

This monorepo contains the following packages:

### HTTP Client (`@jovandyaz/http-client`)

A flexible HTTP client wrapper built around Axios with:

- Type-safe request/response handling
- Configurable interceptors
- Testing utilities for HTTP requests

```sh
# Installation
npm install @jovandyaz/http-client
```

### React Hooks (`@jovandyaz/react-hooks`)

Collection of reusable React hooks that include:

- Storage hooks (useLocalStorage)
- Media hooks (useMediaQueries)

```sh
# Installation with npm
npm install @jovandyaz/react-hooks

# Installation with pnpm
pnpm add @jovandyaz/react-hooks
```

## Development

### Build a package

```sh
npx nx build http-client
npx nx build react-hooks
```

### Add a new package

```sh
npx nx g @nx/js:lib packages/new-package-name --publishable --importPath=@jovandyaz/new-package-name
```

## Versioning and Releasing

This library follows [Semantic Versioning](https://semver.org/). Packages are published to the GitHub Package Registry.

### Local Development Publishing

For testing purposes, you can publish packages locally:

```sh
# Build all packages
npx nx run-many -t build --all

# Publish a specific package
npx nx publish http-client
npx nx publish react-hooks
```

### Automated Publishing

Packages are automatically published via GitHub Actions when:

1. Tags are created with the format `v*` (e.g., `v1.0.0`)
2. Manually triggering the "Publish Packages" workflow from the Actions tab

The GitHub workflow will:

- Build all packages
- Run tests
- Publish all packages to GitHub Package Registry

### Setting up for development

To use these packages in development, add the following to your project's `.npmrc`:

```properties
@jovandyaz:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

And add your GitHub token to your environment variables:

```sh
# Add to your ~/.zshrc or equivalent shell configuration
export GITHUB_TOKEN="your-github-token"
```

To version and release the libraries:

```sh
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the libraries.

## Publishing Packages

The packages in this repository are automatically published to GitHub Packages when a new version tag is pushed to the repository. The publication process is handled by GitHub Actions.

### Manual Publishing

If you need to publish packages manually, follow these steps:

1. Make sure you have a GitHub token with the appropriate permissions
2. Add your GitHub token to your local `.npmrc` file:

```sh
@jovandyaz:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

3. Run the release command:

```sh
GITHUB_TOKEN=YOUR_GITHUB_TOKEN npx nx release --dry-run=false
```

### Creating a New Release

To create a new release that will trigger the automatic publishing workflow:

1. Update the version in package.json files
2. Commit your changes
3. Create and push a new tag:

```sh
git tag v1.0.0
git push origin v1.0.0
```

## Available Scripts

The project includes several helpful scripts in the root `package.json`:

```sh
# Build all packages
pnpm build:all

# Publish all packages
pnpm publish:all

# Version packages individually
pnpm version:http-client patch  # or minor, major, etc.
pnpm version:react-hooks patch  # or minor, major, etc.

# Release packages using nx release
pnpm release
```

## TypeScript Project References

Nx automatically manages TypeScript project references in the `tsconfig.json` files. To manually sync these references:

```sh
npx nx sync
```

To verify references are correct (useful for CI):

```sh
npx nx sync:check
```

## Useful Links

- [Nx Documentation](https://nx.dev)
- [Setting up CI with Nx](https://nx.dev/ci/intro/ci-with-nx)
- [Managing Releases with Nx](https://nx.dev/features/manage-releases)
