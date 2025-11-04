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
        position: "relative",
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
      {book.read && (
        <div
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderBottomLeftRadius: 3,
            borderTopRightRadius: 3,
            padding: "6px 12px",
            color: "white",
            fontWeight: "bold",
            fontSize: 1,
            textTransform: "uppercase",
          }}
        >
          Read
        </div>
      )}
    </Link>
  );
}
