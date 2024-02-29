# Omnivore EPUB

A program to generate epub files from your unarchived [Omnivore](https://omnivore.app) articles.

Forked from [here](https://gist.github.com/kebot/90de9c41742cacf371368d85870c4a75)

## Usage

- Install [Deno](https://deno.com/manual/getting_started/installation)
- Get an API token for Omnivore following instructions [here](https://docs.omnivore.app/integrations/api.html#getting-an-api-token)
- Put your token in the `token` field in [config file](config.json)
- Modify the configuration file if necessary
- In your terminal, go to the app folder and run the following command `deno run -A main.ts`
- The ebook with extension `.epub` should be in the app directory after execution

## Configuration

Configuration options available in the [config file](config.json)

| Option                  | Type     | Description                                           |
| ----------------------- | -------- | ----------------------------------------------------- |
| token                   | string   | Omnivore API Token                                    |
| endpoint                | string   | Omnivore GraphQL API endpoint                         |
| title                   | string   | Title of the ebook                                    |
| author                  | string   | Author of the ebook                                   |
| cover                   | string   | URL for fetching cover image for the ebook            |
| description             | string   | Description of the ebook                              |
| addLabelsInContent      | boolean  | Whether to add the labels for the article below title |
| addArticleLinkInContent | boolean  | Whether to add the link for the article below title   |
| allowImages             | boolean  | Whether to add images linked in article in the ebook  |
| outputFileName          | string   | Ebook file name                                       |
| maxArticleCount         | number   | Number of articles to fetch                           |
| searchQuery             | string   | Valid query for article search, default: "sort:saved-desc". Change it to "sort:saved-asc" for fetching oldest articles first |
| ignoredLabels           | string[] | List of labels to exclude from the ebook              |
| ignoredLinks            | string[] | List of urls to exclude from the ebook                |
| emailSupport            | boolean  | Whether to send the ebook via email (i.e. your eReader) |
| emailHost               | string   | SMTP-Host of your email provider. Example: smtp.gmail.com |
| emailPort               | number   | Usually 465                                           |
| emailUser               | string   | Username/Email address of your email account          |
| emailPassword           | string   | Password of your email account                        |
| emailRecipient          | string   | Email address that should receive your ebook          |

## Send to eReader like Kindle

This program can send the generated ebook to your eReader via email. Many eReader support this:

[Kindle](https://www.amazon.com/sendtokindle/email)
[Pocketbook](https://www.youtube.com/watch?v=lFfWwzi8WEM)

To activate this feature set emailSupport to true and configure the email options in the [config file](config.json).