/** @jsx jsx */
import { jsx } from "theme-ui";
import { Themed, Box } from "theme-ui";

const VoterList = ({ winners = {}, voters = [{ name: "" }] }) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary",
        mt: 4,
        color: "white",
        p: 5,
        pt: 4,
        pb: 5,
        borderRadius: "10px",
      }}
    >
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Themed.h2 sx={{ textAlign: "center" }}>Recent Voter List</Themed.h2>
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
              backgroundColor: "primary",
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
              backgroundColor: "primary",
              color: "background",
              fontWeight: "bold",
            },
            tbody: {
              tr: {
                "&:hover": {
                  backgroundColor: "orange",
                },
              },
            },
          }}
        >
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
                  color: winners[voter.id]?.amount ? "orange" : "white",
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
      )
    </Box>
  );
};

export default VoterList;
