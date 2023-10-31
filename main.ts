import { gql, GraphQLClient } from "npm:graphql-request";
import sanitizeHtml from "npm:sanitize-html";
import epub, { Chapter } from "npm:epub-gen-memory";
import config from "./config.json" with { type: "json" };

const OMNIVORE_API_KEY = config.token;
const OMNIVORE_ENDPOINT = config.endpoint;

const graphQLClient = new GraphQLClient(OMNIVORE_ENDPOINT, {
  headers: {
    authorization: OMNIVORE_API_KEY,
  },
});

async function getUnreadArticles() {
  const query = gql`
    {
      search(first: ${config.maxArticleCount}) {
        ... on SearchSuccess {
          edges {
            cursor
            node {
              title
              slug
              description
              url
              savedAt
              language
              subscription
              isArchived
              author
              labels {
                name
              }
            }
          }
        }
      }
    }
  `;

  type Label = {
    name: string;
  };

  type Edge = {
    cursor: string;
    node: {
      title: string;
      slug: string;
      url: string;
      savedAt: string;
      language: string;
      subscription: string;
      isArchived: boolean;
      author: string;
      labels: Label[];
      labelsArray: string[];
    };
  };

  const data = await graphQLClient.request<{ search: { edges: Edge[] } }>(
    query,
  );

  return data.search.edges.map((e) => {
    if (e.node.labels) {
      e.node.labelsArray = e.node.labels.map((label) => label.name);
    }
    return e.node;
  });
}

async function getArticle(slug: string) {
  const query = gql`{
    article (username: "anonymous", slug: "${slug}") {
      ... on ArticleSuccess {
        article {
          id, slug, url, content
        }
      }
    }
  }`;

  const data = await graphQLClient.request<{
    article: {
      article: {
        id: string;
        slug: string;
        url: string;
        content: string;
      };
    };
  }>(query);

  let allowedTags;
  if (config.allowImages) {
    allowedTags = sanitizeHtml.defaults.allowedTags.concat(["img"]);
  } else {
    allowedTags = sanitizeHtml.defaults.allowedTags.concat();
  }

  const sanitizedArticle = sanitizeHtml(data.article.article.content, {
    allowedTags: allowedTags,
  });

  return {
    ...data.article.article,
    content: sanitizedArticle,
  };
}

async function makeMagazine() {
  console.log("〰️ getting article list");
  const articles = await getUnreadArticles();
  console.log("🤖 done");

  const chapters: Chapter[] = [];

  for (const article of articles) {
    if (!article.isArchived) {
      console.log(`🌐 fetching ${article.title}`);
      let content = (await getArticle(article.slug)).content;

      if (article.labelsArray) {
        if (
          config.ignoredLinks.some((link) => article.url.includes(link)) ||
          article.labelsArray.find((label) => config.ignoredLabels.includes(label))
        ) {
          console.log("⚠️ article skipped");
          continue;
        }
        if (config.addLabelsInContent) {
          content = `<b>Labels: ${article.labelsArray.join(", ")}</b>` + content;
        }
      }
      if (config.addArticleLinkInContent) {
        content = `<a href="${article.url}">Link to Article</a><br><br>` + content;
      }

      chapters.push({
        title: article.title,
        author: article.author ?? "Omnivore",
        content: content,
        filename: article.slug,
      });

      console.log(`✅ done`);
    }
  }

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

  console.log("📚 Successfully created ebook");
}

await makeMagazine();
Deno.exit();
