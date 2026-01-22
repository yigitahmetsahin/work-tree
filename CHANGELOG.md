# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0](https://github.com/yigitahmetsahin/workflow-ts/compare/v1.0.6...v1.1.0) (2026-01-22)


### Features

* add release-please bot for automated releases ([a5c37bf](https://github.com/yigitahmetsahin/workflow-ts/commit/a5c37bfccbbd161642eed7c02fcfd21a2c9bf29b))
* fully automate releases on version bump ([58bd9e1](https://github.com/yigitahmetsahin/workflow-ts/commit/58bd9e132c08b64903435d8073a4a3331e6fe61c))
* use Node 24 and trigger release on tag push ([2e0a385](https://github.com/yigitahmetsahin/workflow-ts/commit/2e0a3854a77377f06968d9e29852c6e4ec02c100))
* use release-please for automated releases ([37a66ed](https://github.com/yigitahmetsahin/workflow-ts/commit/37a66ed50d6116cf2eb790c71d7f379e7ffad638))


### Bug Fixes

* revert to simpler auto-release without bot ([11987af](https://github.com/yigitahmetsahin/workflow-ts/commit/11987af9b3ef903d51e42b280f79df9e40dbc740))

## [Unreleased]

## [1.0.6] - 2026-01-22

### Fixed
- Update npm to latest in CI for OIDC trusted publishing support

## [1.0.5] - 2026-01-22

### Fixed
- Fixed OIDC workflow - removed registry-url to allow automatic OIDC auth

## [1.0.4] - 2026-01-22

### Fixed
- Added NODE_AUTH_TOKEN for npm publish authentication

## [1.0.3] - 2026-01-22

### Fixed
- Updated release workflow for npm OIDC publishing with provenance

## [1.0.2] - 2026-01-22

### Fixed
- Fixed flaky timing tests in CI by adding tolerance for timer resolution variance

## [1.0.1] - 2026-01-22

### Added
- CHANGELOG.md for tracking version history
- GitHub Actions CI workflow for automated testing
- GitHub Actions release workflow with npm Trusted Publishers (OIDC)
- Comprehensive unit tests with Vitest

### Changed
- Restructured project as npm library with proper exports (ESM + CJS)

## [1.0.0] - 2026-01-22

### Added
- Initial release
- `Workflow` class with fluent API for building workflows
- Serial work execution with `.serial()` method
- Parallel work execution with `.parallel()` method
- Full TypeScript type inference for work names and results
- Conditional execution with `shouldRun` option
- Error handling with `onError` callbacks
- Execution timing and duration tracking
- `WorkflowStatus` and `WorkStatus` enums
- Type-safe `IWorkResultsMap` for accessing work results

[Unreleased]: https://github.com/yigitahmetsahin/workflow-ts/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/yigitahmetsahin/workflow-ts/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/yigitahmetsahin/workflow-ts/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/yigitahmetsahin/workflow-ts/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/yigitahmetsahin/workflow-ts/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/yigitahmetsahin/workflow-ts/releases/tag/v1.0.0
