<p align="center">
  <a href="https://hexancore.com/" target="blank"><img src="https://avatars.githubusercontent.com/u/113235766?s=200&v=4" width="120" alt="Hexancore Logo" /></a>
</p>

<h1 align="center">Hexancore</h1>
<p align="center"><i>Full-Stack TypeScript Framework for building epic <b>HexArch</b> designed applications.</i></p>
<h2 align="center">Package: Nx</h2>
<p align="center">
  <img alt="Build" src="https://img.shields.io/github/actions/workflow/status/hexancore/nx/release.yml">
  <a href="https://www.npmjs.com/package/@hexancore/nx"><img src="https://img.shields.io/npm/v/@hexancore/nx.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/@hexancore/nx"><img src="https://img.shields.io/npm/dm/@hexancore/nx.svg" alt="NPM Downloads" /></a>
</p>


## Description

This package includes plugin for Nx tailored for the Hexancore framework.
It enables developers to seamlessly integrate and manage Hexancore projects within the Nx ecosystem, leveraging advanced monorepo tools and streamlined code organization. 

The plugin offers a set of commands and schematics that simplify the creation, configuration, and building of Hexancore applications while ensuring full compatibility with Nx tools. 
Perfect for teams looking to combine the flexibility of Hexancore with the powerful features of Nx.

## Quick Start

```bash
npx create-nx-workspace <workspace-name> --pm pnpm --preset @hexancore/nx --nxCloud skip --workspaceType integrated
```

## Documentation

### Generators

#### app
Creates new application.

```bash
nx g @hexancore/nx:app <directory> --type <backend|frontend>
```

**Options**
- **directory** - Application directory, final: `apps/<directory>` and project name will be `app-<directory where all '/' replaced with '-'>`

- **type** - Application type
  - backend
  - frontend

#### lib

Creates new library.

```bash
nx g @hexancore/nx:lib <directory> --type <backend|frontend|shared>
```

**Options**
- **directory** - Library directory, final: `libs/<directory>` and project name will be `<directory where all '/' replaced with '-'>`

- **type** - Library type
  - backend
  - frontend
  - shared

**More documentation**
https://hexancore.dev/guide/getting-started
