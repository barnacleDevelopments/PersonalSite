/** @jsx jsx */
import { jsx } from "theme-ui"

// Components
import { Flex, Text, Themed, Button } from "theme-ui";

const OrderDialog = ({ onClose, title, message }) => {

  return (
    <Flex sx={{
      bg: "secondary",
      flexDirection: "column",
      p: 4,
      color: "primary"
    }}>
      <Themed.h2 sx={{ mb: 3 }}>{title}</Themed.h2>
      <Text variant="regular">{message}</Text>
      <Button sx={{ mt: 3 }} variant="secondary" onClick={onClose}>Close</Button>
    </Flex>
  )
}

export default OrderDialog;