import { Omnivore } from "npm:@omnivore-app/api";
import epub, { Chapter } from "npm:epub-gen-memory";
import sanitizeHtml from "npm:sanitize-html";
import config from "./config.json" with { type: "json" };
import { sendEmail } from "./email.ts";

const currentVersion = "v0.5.0";

console.log(`ℹ  Omnivore EPUB ${currentVersion}`);
console.log("ℹ️ Homepage: https://github.com/agrmohit/omnivore-epub");

if (!config.token) {
  console.log("❌ Omnivore API token not set");
  console.log(
    "❌ Get a token following instructions on: https://docs.omnivore.app/integrations/api.html#getting-an-api-token",
  );
  console.log("❌ When you have a token, insert it as value for 'token' field in 'config.json' file");
  Deno.exit(1);
}

async function checkForUpdates() {
  let response;
  try {
    response = await fetch("https://api.github.com/repos/agrmohit/omnivore-epub/releases/latest");
  } catch (error) {
    console.error("🚫 Error: Unable to connect. Please check your internet connection");
    console.error(`🚫 Error: ${error}`);
    Deno.exit(1);
  }
  const latestRelease = await response.json();
  const latestReleaseTagName = latestRelease.tag_name;

  if (latestReleaseTagName !== currentVersion && latestReleaseTagName !== undefined) {
    console.log("ℹ  New update available");
    console.log(`ℹ  ${currentVersion} --> ${latestReleaseTagName}`);

    if (config.showReleaseNotes) {
      console.log("ℹ  Release Notes:");
      console.log(latestRelease.body + "\n");
    }
    console.log("🌐 View on Web: https://github.com/agrmohit/omnivore-epub/releases/latest");
  }
}

function sanitizeContent(content: string | null) {
  let allowedTags;
  if (config.allowImages) {
    allowedTags = sanitizeHtml.defaults.allowedTags.concat(["img"]);
  } else {
    allowedTags = sanitizeHtml.defaults.allowedTags.concat();
  }

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: allowedTags,
  });

  return sanitizedContent;
}

async function makeEbook() {
  const omnivore = new Omnivore({
    apiKey: config.token,
    baseUrl: config.endpoint,
  });

  const ignoredLabelsQuery = `-label:${config.ignoredLabels.join(",")}`;
  console.log(`〰️Fetching upto ${config.maxArticleCount} articles`);

  const articles = await omnivore.items.search({
    first: config.maxArticleCount,
    includeContent: true,
    format: "html",
    query: `${config.searchQuery} ${ignoredLabelsQuery}`,
  });
  console.log("🤖 done");

  const chapters: Chapter[] = [];

  for (const edge of articles.edges) {
    const article = edge.node;
    console.log(`🌐 Processing ${article.title}`);
    let content = sanitizeContent(article.content);

    if (
      config.ignoredLinks.some((link) => article.url.includes(link))
    ) {
      console.log("⚠️ Article skipped: Matched ignored link");
      continue;
    }

    if (article.labels?.length) {
      if (config.addLabelsInContent) {
        const labels = article.labels.map((label) => label.name);
        content = `<b>Labels: ${labels.join(", ")}</b>` + content;
      }
    }

    if (config.addArticleLinkInContent) {
      content = `<a href="${article.url}">Link to Article</a><br><br>` + content;
    }

    chapters.push({
      title: article.title,
      author: article.author ?? "",
      content: content,
      filename: article.slug,
    });

    console.log(`✅ done`);
  }

  console.log(`🤖 Processed ${articles.edges.length} articles out of ${articles.pageInfo.totalCount} in your library`);
  console.log(`🤖 ${articles.edges.length - chapters.length} skipped`);
  console.log(`📚 Creating ebook (${config.outputFileName})`);

  const fileBuffer = await epub.default(
    {
      title: config.title,
      author: config.author,
      cover: config.cover,
      description: config.description,
      ignoreFailedDownloads: true,
    },
    chapters,
  );

  await Deno.writeFile(config.outputFileName, fileBuffer);

  console.log("📔 Successfully created ebook");
}

if (config.updateCheck) {
  await checkForUpdates();
} else {
  console.log("🌐 Update checks are disabled");
  console.log("🌐 You can manually check for updates here: https://github.com/agrmohit/omnivore-epub/releases");
}

await makeEbook();

if (config.emailSupport) {
  await sendEmail();
}

Deno.exit();
