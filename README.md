# setup-flyway

This action downloads and installs [Flyway](https://flywaydb.org/) via the [Actions tool-cache utility](https://github.com/actions/toolkit/tree/main/packages/tool-cache).
  
    

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
        uses: actions/setup-flyway@v1
        with:
          version: 5.1.4

      - name: Migrate Database
        run: flyway migrate
```

## Recompiling

If changes are made to the action's code in this repository, or its dependencies, you will need to re-compile the action.

```sh
# Installs dependencies and bundles the code
npm run build

# Bundle the code (if dependencies are already installed)
npm run bundle
```

These commands utilize [esbuild](https://esbuild.github.io/getting-started/#bundling-for-node) to bundle the action and
its dependencies into a single file located in the `dist` folder.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).
