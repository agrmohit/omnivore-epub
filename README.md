# Omnivore EPUB

<!-- Badges start -->

[![GitHub Repo stars](https://img.shields.io/github/stars/agrmohit/omnivore-epub)](https://github.com/agrmohit/omnivore-epub)
[![Gitea Stars](https://img.shields.io/gitea/stars/agrmohit/omnivore-epub?gitea_url=https%3A%2F%2Fcodeberg.org&logo=codeberg)](https://codeberg.org/agrmohit/omnivore-epub)
[![GitHub Release](https://img.shields.io/github/v/release/agrmohit/omnivore-epub)](https://github.com/agrmohit/omnivore-epub/releases)
[![License](https://img.shields.io/badge/license-MIT-informational)](LICENSE)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/agrmohit/omnivore-epub)
[![Common Changelog](https://common-changelog.org/badge.svg)](https://common-changelog.org)

<!-- Badges end -->

A program to generate epub file from articles saved in your [Omnivore](https://omnivore.app) library and optionally send
it to your eReader using email.

Omnivore is an open source read-it-later app similar to Pocket and Instapaper.

Forked from [here](https://gist.github.com/kebot/90de9c41742cacf371368d85870c4a75)

## OS Support

This program uses no OS specific code and should work on all platforms supported by `Deno`.

## Download

- To download the latest version of the program, you can use git to clone the repository
- If you are not familiar with git, you can always download the latest version by going to
  [the latest GitHub release](https://github.com/agrmohit/omnivore-epub/releases/latest)
- Then, under `Assets` click on `Source code (zip)` which will download the latest release of the program in a zip file
  which you will need to unzip.
- The program checks for updates when run and will notify you of new releases when available. This can be disabled in
  the config file.

## Usage

- Install [Deno](https://deno.com/manual/getting_started/installation)
- Get an API token for Omnivore following instructions
  [here](https://docs.omnivore.app/integrations/api.html#getting-an-api-token)
- Put your token in the `token` field in [config file](config.json)
- Modify the configuration file if necessary
- In your terminal, go to the app folder and run the following command `deno run -A main.ts`
- The ebook with extension `.epub` should be in the app directory after execution

## Send to eReader like Kindle

List of eReaders that support sending ebook using email:

- [Kindle](https://www.amazon.com/sendtokindle/email)
- [Pocketbook](https://www.youtube.com/watch?v=lFfWwzi8WEM)

> [!TIP]
>
> Make sure the email address used is approved to send ebook to your eReader

### Configuring email

- Ability to send ebook over email is disabled by default
- To enable it, set `emailSupport` to `true` in the [config file](config.json)
- Set `emailHost` to the [SMTP](https://www.cloudflare.com/en-in/learning/email-security/what-is-smtp/) address of your
  email provider
- E.g. `smtp.gmail.com` for Gmail and `smtp-mail.outlook.com` for Outlook
- Set `emailPort` to the SMTP Port. Usually it is 587, 465 or 25
- Set `emailUser` which is usually your email address
- Set `emailPassword` to your email account password. This is stored locally on your device and is never sent to us
- Set `emailRecipient` to the email you want to receive ebook on (your eReader's email address). See the links in list
  of eReaders above to know more
- You may need to set `emailAllowSTARTTLS` to false when using `465` as `emailPort`. Leave it to `true` when not sure

> [!CAUTION]
>
> The email password is stored in plaintext on your device, unencrypted. Therefore, it is highly recommended to use app
> password instead of your account password whenever your email provider supports it
>
> You may also need to turn on 2FA (Two Factor Authentication)
>
> Instructions for setting an app password for a few popular email providers:
>
> - [Gmail](https://support.google.com/accounts/answer/185833)
> - [Outlook](https://support.microsoft.com/en-us/account-billing/5896ed9b-4263-e681-128a-a6f2979a7944)
> - [Zoho Mail](https://help.zoho.com/portal/en/kb/bigin/channels/email/articles/generate-an-app-specific-password)

## Configuration

Configuration options available in the [config file](config.json)

| Option                   | Type     | Description                                              |
| ------------------------ | -------- | -------------------------------------------------------- |
| token                    | string   | Omnivore API Token                                       |
| endpoint                 | string   | Omnivore GraphQL API endpoint                            |
| title                    | string   | Title of the ebook                                       |
| author                   | string   | Author of the ebook                                      |
| cover                    | string   | URL for fetching cover image for the ebook               |
| description              | string   | Description of the ebook                                 |
| addLabelsInContent       | boolean  | Whether to add the labels for the article below title    |
| addArticleLinkInContent  | boolean  | Whether to add the link for the article below title      |
| allowImages              | boolean  | Whether to add images linked in article in the ebook     |
| outputFileName           | string   | ebook file name                                          |
| maxArticleCount          | number   | Number of articles to fetch                              |
| searchQuery              | string   | Valid query for article search                           |
| ignoredLabels            | string[] | List of labels to exclude from the ebook                 |
| ignoredLinks             | string[] | List of urls to exclude from the ebook                   |
| emailSupport             | boolean  | Whether to send the ebook via email (to your eReader)    |
| emailHost                | string   | SMTP Hostname of your email provider                     |
| emailPort                | number   | Usually one of 587, 465 or 25. Prefer 587 when available |
| emailUser                | string   | Username/Email address of your email account             |
| emailPassword            | string   | Password of your email account. Prefer app password      |
| emailRecipient           | string   | Email address that should receive your ebook             |
| emailFrom                | string   | Sender name that appears to the email receiver           |
| emailAllowSTARTTLS       | boolean  | Allow connecting to the SMTP server using STARTTLS       |
| emailSizeWarningSuppress | boolean  | Show a warning if ebook is over emailSizeWarningMinSize  |
| emailSizeWarningMinSize  | number   | Min ebook size to show warning while sending email in MB |
| updateCheck              | boolean  | Check for updates when run                               |
| showReleaseNotes         | boolean  | Show release notes when an update is available           |

### Custom searchQuery

Setting `searchQuery` is the recommended way to filter and sort articles. You can learn more about how to use them on
the official Omnivore documentation [Search | Omnivore Docs](https://docs.omnivore.app/using/search.html).

The default value is `sort:saved-desc` which returns all unarchived articles sorted by saved date, recently added
articles first.

You can also use it to filter by labels. In case the label contain a space, you will need to escape the double-quotes
using a forward slash `\`. Example: `sort:saved-desc label:\"Send to Kindle\"`
