/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import { Flex, Text, Button } from "theme-ui";

const OrderDialog = ({ onClose, title, message }) => {
  return (
    <Flex
      sx={{
        bg: "secondary",
        flexDirection: "column",
        p: 4,
        color: "primary",
      }}
    >
      <h2 sx={{ mb: 3 }}>{title}</h2>
      <Text variant="regular">{message}</Text>
      <Button sx={{ mt: 3 }} variant="secondary" onClick={onClose}>
        Close
      </Button>
    </Flex>
  );
};

export default OrderDialog;
