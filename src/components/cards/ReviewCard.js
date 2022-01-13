/** @jsx jsx */
import { jsx } from "theme-ui"
import { Text } from "theme-ui";
import showdown from "showdown";

// Components
import { Card } from "theme-ui";

// markup
const ReviewCard = ({ content }) => {
  const converter = new showdown.Converter();
  return (
    <Card sx={{
      mt: 3,
    }}>
      <Text sx={{ "strong": { fontWeight: "bold", lineHeight: 3, } }} variant="large" dangerouslySetInnerHTML={{ __html: converter.makeHtml(content) }} />
    </Card >
  )
}

export default ReviewCard;