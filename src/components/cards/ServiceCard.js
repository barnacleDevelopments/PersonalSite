/** @jsx jsx */
import { jsx } from "theme-ui"
import { useState } from 'react'
import { CSSTransition } from "react-transition-group"
import "../../css/estimate_form_transitions.css"

// Components
import Shadow from "../Shadow"
import { Box, Text, Themed, Card, Flex, Button } from "theme-ui";
import BasicEstimateForm from "../forms/BasicEstimateForm";

function ServiceCard({ features, title, startPrice }) {
  const [estimateMenuStatus, setEstimateMenuStatus] = useState(false);

  function startEstimate(e, type) {
    e.preventDefault()
    setEstimateMenuStatus(true)
    if (type === "Basic") {
      disableScroll();
    }
  }

  function disableScroll() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () { window.scrollTo(x, y); };
    window.document.body.style.overflow = "hidden"
  }

  function enableScroll() {
    window.document.body.style.overflow = "unset"
    window.onscroll = function () { };
  }

  function toggleEstimateForm(e) {
    if (estimateMenuStatus) {
      setEstimateMenuStatus(false);
      enableScroll();
    } else {
      setEstimateMenuStatus(false);
      disableScroll();
    }
  }

  return (
    <Card sx={{ bg: "primary", color: "white" }}>
      {/* ESTIMATE MENU */}
      <CSSTransition
        in={estimateMenuStatus} timeout={100} classNames="estimate">
        <div>
          {estimateMenuStatus &&
            <Shadow>
              <BasicEstimateForm onClose={toggleEstimateForm} />
            </Shadow>}
        </div>
      </CSSTransition>

      {/* CARD CONTENTS */}
      <Themed.h3 sx={{ px: 3, my: 3 }}>{title}</Themed.h3>
      <Box sx={{
        bg: "secondary",
        'li': {
          padding: "18px 22px",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: "primary",
          borderBottom: 'none'
        }
      }}>
        <ul>
          {features.map((item, index) =>
            <li key={index}><Text sx={{ fontWeight: 300 }} variant="regular">{item}</Text></li>
          )}
        </ul>
      </Box>
      <Flex sx={{
        flexDirection: "column",
        alignItems: "center",
        pt: 2,
        pb: 5
      }}>
        <Text sx={{ mt: 2 }}>STARTING AT</Text>
        <Themed.h3>${startPrice.toFixed(2)}</Themed.h3>
        <Button variant="primary" sx={{
          mt: 3
        }} onClick={(e) => { startEstimate(e, "Basic") }
        }>Get Estimate</Button>
      </Flex>
    </Card>
  )
}

export default ServiceCard;