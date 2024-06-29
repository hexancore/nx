# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- bump Nx to `19.3.1`
- bump hexancore/common in preset to `0.15.*`
- bump hexancore/core in preset to `0.16.*`
- bump hexancore/auth in preset to `0.5.*`
- bump hexancore/cloud in preset to `0.3.*`
- bump hexancore/typeorm in preset to `0.16.*`

### Fixed

- fixed `.nx` in preset .gitingore

## [0.3.0] - 2024-06-10

### Added

- added serve target to backend and frontend application generator.
- added `unplugin-vue-components` vite plugin - auto-importing vue components.
- added automatic frontend application libs resolve(in dev mode library src code is used - hmr works perfect !).
- added better vite project configuration controlling options.
- added tsconfig.frontend.base.json used by frontend application and libraries.

### Changed

- reworked preset workspace structure(moved more code to plugin and simplified generated per project).
- reworked vite build configuration.
- simplified example generated source code in frontend application and library.

### Updated

- bumps deps(and Nx 19.2.2).

## [0.2.0] - 2024-05-31

### Added

- added application generator.
- added frontend library generator.
- added basic docker-compose yaml with postgres and redis.
- added storybook to frontend apps and libs.
- added `targetDefaults` to nx.json

### Changed

- reworked preset workspace structure

### Updated

- bumps deps(and Nx 19.1.1).

## [0.1.1] - 2024-05-18

## Fixed

- fixes first publish.

## [0.1.0] - 2024-05-18

### Added

- Inital release.

[unreleased] https://github.com/hexancore/nx/compare/0.3.0...HEAD
[0.3.0] https://github.com/hexancore/nx/compare/0.2.0...0.3.0  
[0.2.0] https://github.com/hexancore/nx/compare/0.1.1...0.2.0  
[0.1.1] https://github.com/hexancore/nx/compare/0.1.0...0.1.1  
[0.1.0] https://github.com/hexancore/nx/releases/tag/0.1.0
