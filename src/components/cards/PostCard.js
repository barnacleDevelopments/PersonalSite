/** @jsx jsx */
import { jsx } from "theme-ui"
import { GatsbyImage } from "gatsby-plugin-image";
import { getImage } from "gatsby-plugin-image";
import showdown from "showdown";

// Components
import { Themed, Card, Text, Button, Box, Grid, Link } from "theme-ui";

// markup
const PostCard = ({ post }) => {
  const cardImage = getImage(post.thumnail)
  const converter = new showdown.Converter();

  function truncateSentence(str) {
    let strArr = str.split(' ');
    let firstSentence = "";

    strArr.some((w) => {
      firstSentence = firstSentence.concat(w + " ")
      return w[w.length - 1] === "."
    });

    return firstSentence
  }

  return (
    <Card variant="primary" sx={{
      color: "white",
      height: "max-content"
    }}>
      <Grid gap={0} columns={[1, 1, 1, "1fr 3fr", "1fr 5fr"]}>
        {post.thumnail && <GatsbyImage style={{ height: "200px" }} imgStyle={{ objectFit: "cover" }} placeholder="blurred" crossOrigin="anonymous" image={cardImage} alt={post.title} />}
        <Box sx={{
          bg: "primary",
          width: "100%",
          p: 3,
        }}>
          <Themed.h3 sx={{
            whiteSpace: "nowrap",
            maxWidth: "100%",
            textOverflow: "ellipsis",
            overflow: "hidden",
            height: "38px"
          }}>{post.title}</Themed.h3>
          <Text sx={{
            'a': { color: "orange" },
          }} variant="small" dangerouslySetInnerHTML={{ __html: converter.makeHtml(truncateSentence(post.content)) }}></Text>
          <Box>
            <Link href={`${post.slug}`}><Button variant="secondary" sx={{ mt: 3 }} className="secondary-btn">Read</Button></Link>
          </Box>
        </Box>
      </Grid>

    </Card>
  )
}

export default PostCard;