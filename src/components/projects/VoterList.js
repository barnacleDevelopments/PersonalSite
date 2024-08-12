/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Heading } from "theme-ui";

const VoterList = ({ winners = {}, voters = [{ name: "" }] }) => {
  console.log("VOTERS: ", voters);
  return (
    <Box
      as="section"
      sx={{
        backgroundColor: "primary",
        mt: [3, 4],
        color: "white",
        px: [4, 5],
        pt: [3, 4],
        pb: [4, 5],
        borderRadius: "10px",
      }}
    >
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <table
          sx={{
            mt: 3,
            width: "100%",
            mx: "auto",
            borderCollapse: "separate",
            borderSpacing: 0,
            borderTop: "2px solid white",
            "th, td": {
              textAlign: "left",
              borderBottomStyle: "solid",
              borderBottomWidth: "2px",
              borderBottomColor: "white",
              px: 3,
              py: 2,
              color: "text",
              ":first-of-type": {
                borderLeftStyle: "solid",
                borderLeftWidth: "2px",
                borderLeftColor: "white",
              },
              ":last-of-type": {
                borderRightStyle: "solid",
                borderRightWidth: "2px",
                borderRightColor: "white",
              },
            },
            th: {
              color: "background",
              fontWeight: "bold",
            },
          }}
        >
          <caption sx={{ mb: 3 }}>Voter List & Winners</caption>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Closing Prize Balance</th>
            </tr>
          </thead>
          <tbody>
            {voters.map((voter, index) => (
              <tr
                key={voter?.id}
                sx={{
                  color: winners[voter.id]?.amount > 0 ? "orange" : "white",
                }}
              >
                <td>{index + 1}</td>
                <td>{voter.name}</td>
                <td>{winners[voter.id]?.amount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default VoterList;
