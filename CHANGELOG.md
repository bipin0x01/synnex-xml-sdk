# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, and GitHub issue/PR templates for open-source contributions
- Expanded README with full API reference and development guide
- `.env.example` for local integration test setup

## [1.1.25] - 2025-07-16

### Added

- Invoice query support via `getInvoice`
- Manufacturer part number lookup via `getMfgPnBySku`
- Freight quote helpers (`getFreightQuote`, `getFreightWithZip`)

### Changed

- Improved response normalization for items, packages, and ship methods

## [1.0.0] - 2024

### Added

- Initial TypeScript SDK for TD SYNNEX XML API
- Purchase order submission (`submitPO`)
- Order status (`getOrderStatus`)
- Price and availability (`getPriceAvailability`)
- Sandbox and production environments for US and CA

[Unreleased]: https://github.com/bipin0x01/synnex-xml-sdk/compare/v1.1.25...HEAD
[1.1.25]: https://github.com/bipin0x01/synnex-xml-sdk/releases/tag/v1.1.25
[1.0.0]: https://github.com/bipin0x01/synnex-xml-sdk/releases/tag/v1.0.0
