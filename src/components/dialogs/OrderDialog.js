/** @jsx jsx */
import { jsx } from "theme-ui"

// Components
import { Flex, Text, Themed, Button } from "theme-ui";

const OrderDialog = ({ onClose }) => {

  return (
    <Flex sx={{
      bg: "secondary",
      flexDirection: "column",
      p: 4,
      color: "primary"
    }}>
      <Themed.h2 sx={{ mb: 3 }}>Order Request Successfull</Themed.h2>
      <Text variant="regular">I will be in touch with you shorty. An email was sent to you containing your estimate.</Text>
      <Button sx={{ mt: 3 }} variant="secondary" onClick={onClose}>Close</Button>
    </Flex>
  )
}

export default OrderDialog;