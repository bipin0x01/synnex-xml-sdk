# Security Policy

## Supported versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a vulnerability

If you discover a security issue in **synnex-xml-sdk**, please report it privately.

**Do not** open a public GitHub issue for security vulnerabilities.

Instead, email **bt.kaji@gmail.com** with:

- A description of the issue
- Steps to reproduce (if possible)
- Impact assessment (what an attacker could do)
- Any suggested fix (optional)

You should receive an acknowledgment within a few business days. We will work with you to understand and address the issue, and coordinate a disclosure when a fix is available.

## Credential safety

This SDK talks to the TD SYNNEX API using credentials you provide. Please:

- Never commit `.env` files, API passwords, or account numbers
- Prefer environment variables or a secrets manager in production
- Rotate credentials if they may have been exposed
- Avoid pasting live API responses that contain customer or order data into public issues or PRs
