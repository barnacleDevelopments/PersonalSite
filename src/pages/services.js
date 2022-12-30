/** @jsx jsx */
import { jsx } from "theme-ui"

// COMPONENTS
import Layout from "../components/app/Layout";
import { Box, Text, Themed, Grid, Button, Link } from "theme-ui";
import Seo from "../components/app/Seo";
import ServiceCard from "../components/cards/ServiceCard";

const ServicesPage = () => {
  return (
    <Layout>
      <Seo title="Services" />
      <Box sx={{
        margin: "0 auto",
        width: ["90%", "80%", "70%"],
        my: 6
      }}>
        <Box sx={{ mt: 6, mb: 5 }}>
          <Themed.h1 sx={{
            mb: 3,
            color: "primary",
          }}>Services</Themed.h1>
          <Text variant="large">Get an estimate by selecting a project bellow or <a href="/contact">send me an email!</a></Text>
        </Box>
        <Grid gap={3} columns={[1, null, 2]}>
          <ServiceCard
            title="Basic 5 Page Site"
            features={[
              'SEO Optimization',
              'Custom Styling and Layout',
              'Smartphone and Tablet Ready',
              'One Language'
            ]}
            startPrice={1500}
          />
          <Box sx={{
            textAlign: ["center"],
          }}>
            <Box sx={{
              bg: "primary",
              color: "white",
              px: 3,
              py: 4
            }}>
              <Box>
                <Themed.h3 sx={{ mb: 3 }}>Something Else?</Themed.h3>
              </Box>
              <Box>
                <Text variant="regular" sx={{ color: "white", fontWeight: 300 }}>
                  Sometimes businesses need something more feature rich.
                  If you have an idea please reach out!
                </Text>
              </Box>
              <Box>
                <Link href="/contact"><Button variant="secondary" sx={{ mt: 4 }} >Contact Me</Button></Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Layout >
  )
}

export default ServicesPage;