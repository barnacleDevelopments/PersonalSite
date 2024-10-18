/** @jsx jsx */
import { jsx } from "theme-ui";
import { GatsbyImage } from "gatsby-plugin-image";
import { getImage } from "gatsby-plugin-image";
import showdown from "showdown";

// Components
import { Heading, Card, Text, Button, Box, Grid, Link } from "theme-ui";

// markup
const PostCard = ({ post, postContent }) => {
  const cardImage = getImage(post.thumbnail);
  const converter = new showdown.Converter();

  function truncateSentence(str) {
    let strArr = str.split(" ");
    let firstSentence = "";

    strArr.some((w) => {
      firstSentence = firstSentence.concat(w + " ");
      return w[w.length - 1] === ".";
    });

    return firstSentence;
  }

  return (
    <Card
      variant="primary"
      sx={{
        color: "white",
        height: "max-content",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Grid gap={0} columns={[1, 1, 1, "1fr 3fr", "1fr 5fr"]}>
        {post.thumbnail && (
          <GatsbyImage
            style={{ height: "200px" }}
            imgStyle={{ objectFit: "cover" }}
            placeholder="blurred"
            crossOrigin="anonymous"
            image={cardImage}
            alt={post.title}
          />
        )}
        <Box
          sx={{
            bg: "primary",
            width: "100%",
            p: 3,
          }}
        >
          <Heading
            as="h2"
            variant="subheading1"
            sx={{
              whiteSpace: "nowrap",
              maxWidth: "100%",
              textOverflow: "ellipsis",
              overflow: "hidden",
              height: "38px",
              color: "white",
            }}
          >
            {post.title}
          </Heading>
          <Text variant="regular" sx={{ color: "white" }}>
            {post.date}
          </Text>
          <Text
            sx={{
              a: { color: "orange" },
              color: "white",
            }}
            variant="small"
            dangerouslySetInnerHTML={{
              __html: converter.makeHtml(truncateSentence(postContent)),
            }}
          ></Text>
          <Box>
            <Link href={`${post.slug}`}>
              <Button
                variant="secondary"
                sx={{ mt: 3 }}
                className="secondary-btn"
              >
                Read
              </Button>
            </Link>
          </Box>
        </Box>
      </Grid>
    </Card>
  );
};

export default PostCard;
