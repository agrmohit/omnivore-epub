# Changelog

## [v0.6.0] - 2024-03-30

### Features

- Switch to Omnivore API Client Library for Node.js
- Add CHANGELOG.md

## [v0.5.0] - 2024-03-14

### Features

- Escape quotes in search query (by @tmr232 in #6)
- New config option to check for updates when run
- New config option to show release notes when new update is available

### Fixes

- Check for latest release instead of latest tag

### Documentation

- How to use a custom search query along with the required escaping quotes in some cases
- The ability to filter by label using search query

## [v0.4.1] - 2024-03-02

### Fixes

- Add a body to every email because some eReader mailing services may reject emails with an empty body

## [v0.4.0] - 2024-03-02

### Features

- Send ebook via email to eReaders like Kindle or Pocketbook (by @sascharucks in #4)
- Show Release notes in terminal when a new release is available

### Fixes

- Properly handle error when internet is unavailable and communicate it to user

### Maintenance

- Improve usage instructions

## [v0.3.0] - 2024-01-10

### Features

- Reduce default article count from 100 to 15 in order to reduce processing time and output file size (by @zsoltika)
- Add new option for search-string specifier which can also be used to change the article fetch order to oldest article
  first from the current default of newest article first (by @zsoltika)

[v0.6.0]: https://github.com/agrmohit/omnivore-epub/releases/tag/v0.6.0
[v0.5.0]: https://github.com/agrmohit/omnivore-epub/releases/tag/v0.5.0
[v0.4.1]: https://github.com/agrmohit/omnivore-epub/releases/tag/v0.4.1
[v0.4.0]: https://github.com/agrmohit/omnivore-epub/releases/tag/v0.4.0
[v0.3.0]: https://github.com/agrmohit/omnivore-epub/releases/tag/v0.3.0
