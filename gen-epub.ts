// get a list of articles based on search endpoint
import { gql, GraphQLClient } from "npm:graphql-request";
import sanitizeHtml from "npm:sanitize-html";
import epub, { Chapter } from "npm:epub-gen-memory";

const OMNIVORE_API_KEY = "";
const OMNIVORE_ENDPOINT = "https://api-prod.omnivore.app/api/graphql";

const graphQLClient = new GraphQLClient(OMNIVORE_ENDPOINT, {
  headers: {
    authorization: OMNIVORE_API_KEY,
  },
});

async function getUnreadArticles() {
  const query = gql`
    {
      search(first: 100) {
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
    article (username: "K.Y.", slug: "${slug}") {
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

  const sanitizedArticle = sanitizeHtml(data.article.article.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  });

  return {
    ...data.article.article,
    content: sanitizedArticle,
  };
}

// mark sended

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
          article.url.includes("https://www.youtu") || article.url.includes("https://youtu") ||
          article.labelsArray.find((label) => label == "pdf")
        ) {
          console.log("⚠️ article skipped because its either a YouTube video or a pdf");
          continue;
        }
        content = `<b>Labels: ${article.labelsArray.join(", ")}</b>` + content;
      }
      content = `<a href="${article.url}">Link to Article</a><br><br>` + content;

      chapters.push({
        title: article.title,
        author: article.author ?? "Omnivore",
        content: content,
        filename: article.slug,
      });

      console.log(`✅ done`);
    }
  }

  // make a PDF and save it

  const fileBuffer = await epub.default(
    {
      title: "Omnivore Articles",
      author: "Omnivore",
      cover: "https://cdn.discordapp.com/attachments/779248028824764426/1149996974234423346/cover.jpg",
      description: "Articles from Omnivore",
      ignoreFailedDownloads: true,
    },
    chapters,
  );

  await Deno.writeFile("./output.epub", fileBuffer);

  console.log("📚 Successfully created ebook");
}

await makeMagazine();
Deno.exit();
