import { Box, Heading, Link, Text } from "theme-ui";

function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);

  const intervals = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
  ];

  for (const { unit, seconds: intervalSeconds } of intervals) {
    const count = Math.floor(seconds / intervalSeconds);
    if (count >= 1) {
      return `${count} ${unit}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

const wrapperStyles = {
  bg: "rgba(255, 255, 255, 0.08)",
  borderRadius: 8,
  p: 3,
  width: ["100%", "100%", "320px"],
  flexShrink: 0,
  overflowY: "auto",
  scrollbarWidth: "thin",
  scrollbarColor: "#FFA630 rgba(255,255,255,0.1)",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    bg: "rgba(255,255,255,0.1)",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    bg: "orange",
    borderRadius: "3px",
  },
};

export default function CommitLog({ commits }) {
  return (
    <Box sx={wrapperStyles}>
      <Heading
        as="h3"
        sx={{ fontSize: 1, mb: 2, color: "orange", fontStyle: "normal" }}
      >
        Recent Commits
      </Heading>
      <Box as="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
        {commits.map((commit) => (
          <Box
            as="li"
            key={commit.sha}
            sx={{
              py: 2,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              "&:last-child": { borderBottom: "none" },
            }}
          >
            <Link
              href={commit.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: 0,
                color: "white",
                fontWeight: "bold",
                mb: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "wrap",
                display: "block",
                textDecoration: "none",
                "&:hover": { color: "orange" },
              }}
            >
              {commit.message}
            </Link>
            <Text
              sx={{
                fontSize: 0,
                color: "rgba(255,255,255,0.5)",
                display: "block",
                mt: 1,
              }}
            >
              {commit.author} &middot; {timeAgo(commit.date)}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
