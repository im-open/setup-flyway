# setup-flyway

This action downloads and installs [Flyway](https://flywaydb.org/) via the [Actions tool-cache utility](https://github.com/actions/toolkit/tree/main/packages/tool-cache).
  
- [Inputs](#inputs)
- [Example](#example)
- [Contributing](#contributing)
  - [Recompiling](#recompiling)
  - [Incrementing the Version](#incrementing-the-version)
- [Code of Conduct](#code-of-conduct)
- [License](#license)    

## Inputs
| Parameter      | Is Required | Description                                                                                                          |
| -------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- |
| `version`      | true        | The version of Flyway to install                                                                                     |
| `architecture` | false       | Target operating system architecture for Flyway to use. Examples: x86, x64. Will use system architecture by default. |

## Example

```yml
jobs:
  migrate-database:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Setup Flyway
        uses: im-open/setup-flyway@v1.0.1
        with:
          version: 5.1.4

      - name: Migrate Database
        run: flyway migrate
```

## Contributing

When creating new PRs please ensure:
1. The action has been recompiled.  See the [Recompiling](#recompiling) section below for more details.
2. For major or minor changes, at least one of the commit messages contains the appropriate `-semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
3. The `README.md` example has been updated with the new version.  See [Incrementing the Version](#incrementing-the-version).
4. The action code does not contain sensitive information.

### Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge.  The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment                     |
| -------------- | ------------------------------------------- |
| major          | -semver:breaking                            |
| major          | -semver:major                               |
| minor          | -semver:feature                             |
| minor          | -semver:minor                               |
| patch          | -default increment type, no comment needed- |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).
