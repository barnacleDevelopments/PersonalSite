/** @jsx jsx */
import { jsx } from "theme-ui"
import { useState } from "react"
import 'react-picky/dist/picky.css';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { CSSTransition } from "react-transition-group";

// Components 
import { Box, Text, Themed, Button } from "theme-ui";
import OrderDialog from "../dialogs/OrderDialog";
import Loader from "../Loader";

const OrderForm = ({ estimate, onClose }) => {
  const { handleSubmit } = useForm();
  const [orderSuccessDialogStatus, setOrderSuccessDialogStatus] = useState(false);
  const [orderFailDialogStatus, setOrderFailDialogStatus] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);

  const onSubmit = () => {
    setLoaderStatus(true)
    fetch("/.netlify/functions/submit_order", {
      method: "POST",
      body: JSON.stringify(estimate)
    }).then((response) => {
      setLoaderStatus(false)
      if(response.status !== 200) {
        setOrderFailDialogStatus(true)
        return;
      }
      setOrderSuccessDialogStatus(true)
   
    });
  }

  return (
    <CSSTransition
      in={orderSuccessDialogStatus} timeout={100} classNames="estimate">
      {
        orderSuccessDialogStatus ?
          <OrderDialog title="Order Request Successfull" 
            message="I will be in touch with you shorty. 
          An email was sent to you containing your estimate."
            onClose={onClose} />
          : orderFailDialogStatus ? 
          <OrderDialog title="Order Request Failed"
            message="We are currently working on a fix. Please try again later."
          onClose={onClose} /> : 
          loaderStatus ?
           <Loader /> :
            <Box sx={{ bg: "secondary" }} >
              <Box sx={{ bg: "primary", color: "white", p: 3 }} >
                <Themed.h2 sx={{ mb: 2 }}>Your Estimate</Themed.h2>
                <Themed.h3 sx={{ fontWeight: 300, ml: 3 }}>{estimate.firstName} {estimate.lastName}</Themed.h3>
              </Box>
              <Box sx={{ "strong": { fontWeight: "bold" }, p: 3, color: "primary" }}>
                <Box className="order-form-contact-info">
                  <Themed.h4 sx={{ mb: 2 }}>Contact Info</Themed.h4>
                  <ul>
                    <li><strong>Email: </strong><span>{estimate.email}</span></li>
                  </ul>
                </Box>
                <Box className="order-form-features">
                  <Themed.h4 sx={{ mb: 2 }}>Included Features</Themed.h4>
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <strong>Contact Form: </strong>
                      <span>{estimate.hasContactForm ? <FontAwesomeIcon color="green" icon={faCheck} /> :
                        <FontAwesomeIcon color="red" icon={faTimes} />}</span>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <strong>CMS Integration: </strong>
                      <span>{estimate.hasCMS ? <FontAwesomeIcon color="green" icon={faCheck} /> :
                        <FontAwesomeIcon color="red" icon={faTimes} />}</span>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <strong>SEO Campain: </strong>
                      <span>{estimate.hasSEO ? <FontAwesomeIcon color="green" icon={faCheck} /> :
                        <FontAwesomeIcon color="red" icon={faTimes} />}</span>
                    </Box>
                  </Box>
                </Box>
                <p className="order-form-total">Estimated Total: <span>${estimate.totalCost?.toFixed(2)}</span></p>
                <Box sx={{ mt: 4 }}>
                  <Button variant="primary" sx={{ width: "100%", mb: 3 }} onClick={handleSubmit(onSubmit)}>Request Order</Button>
                  {/* TODO: <a href="/" className="secondary-btn">Save Order</a> - Implement later */}
                  <Button variant="secondary" sx={{ width: "100%", mb: 3 }} onClick={onClose}>Back</Button>
                  <Text sx={{ fontSize: 1 }} >
                    This auto generated estimate is based on the commonly requested features.
                    Additional features beyond those mentioned may result in additional charges.
                  </Text>
                </Box>
              </Box>
            </Box>
      }
    </CSSTransition>
  )
}

export default OrderForm;