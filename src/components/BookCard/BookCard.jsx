/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "gatsby";
import { GatsbyImage, getImage } from "gatsby-plugin-image";

export default function BookCard({ book }) {
  const image = getImage(book.image);
  return (
    <Link
      to={book.url}
      sx={{
        width: "150px",
        flex: "0 0 auto",
      }}
    >
      <GatsbyImage
        sx={{
          width: "100%",
          border: "2px solid black",
          borderColor: "primary",
          borderRadius: 3,
        }}
        key={book.title}
        alt={book.title}
        image={image}
      />
    </Link>
  );
}
