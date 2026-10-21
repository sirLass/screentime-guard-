# Security Policy

## Reporting a vulnerability

If you find a security vulnerability in ScreenTime Guard, **please do not open a public issue.**

Instead, report it privately:

1. Preferred: use GitHub's **Security → Report a vulnerability** (private advisory) on this repository.
2. Alternative: email the maintainers (contact TBD — will be filled in before the repository is made public).

Please include:

- What the vulnerability allows (e.g., "a child can read the parent PIN hash", "limit bypass via X")
- Steps to reproduce
- Affected version/commit
- Any suggested fix, if you have one

You can expect an initial response within 7 days. We will credit reporters who wish to be acknowledged (unless you prefer to remain anonymous).

## Threat model (summary)

The attacker we design for is a **curious or motivated child on the same device**, not a remote adversary or a full-OS admin. Relevant surfaces:

| Surface                    | Mitigation                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------------- |
| PIN storage                | Salted hash (PBKDF2) only; never plaintext; lockout after failed attempts (FR-4.2, FR-4.4)          |
| Data exposure to web pages | Settings/rules/usage live in `chrome.storage`, unreachable from content scripts or page JS (FR-5.6) |
| Tampering via storage      | No extension storage is writable from web content; managed policies cover removal (FR-5.x)          |
| Future cloud sync          | Row-level security, HTTPS only, rate limiting (PRD §6.3) — Phase 2                                  |

Out of scope: OS-level compromise, another browser/profile with no extension installed (documented limitation, see the future `docs/make-it-harder-to-remove.md`), and physical access attacks.

## Supported versions

Only the latest release on `main` receives security fixes. The project is pre-1.0; there are no supported LTS branches yet.
