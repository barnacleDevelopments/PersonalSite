/** @jsx jsx */
import { jsx } from "theme-ui"

// COMPONENTS
import Layout from "../components/app/Layout";
import { Box, Text, Themed, Grid, Button, Link } from "theme-ui";
import Seo from "../components/app/Seo";
import ServiceCard from "../components/cards/ServiceCard";
import { StaticImage } from "gatsby-plugin-image";
import BubbleCanvas from "../components/BubbleCanvas";

const ServicesPage = () => {

  const skills = [
    "/assets/angular_icon.png", 
    "/assets/react_icon.png", 
    "/assets/javascript_logo.png", 
    "/assets/net_logo.png",
    "/assets/vue_logo.png",
    "/assets/azure_logo.png",
    "/assets/chat_logo.png",
    "/assets/mssql_logo.png",
    "/assets/git_logo.png",
  ]


  return (
    <Layout>
      <Seo title="About" />
      <Box sx={{
        margin: "0 auto",
        width: ["90%", "80%", "70%"],
        my: 6
      }}>
        <Box sx={{ mt: 6, mb: 5 }}>
          <Themed.h1 sx={{
            mb: 3,
            color: "primary",
          }}>A Little More About Me</Themed.h1>
          <Box>
             <StaticImage style={{ height: "300px" }} 
              src="../images/devin_climbing.jpg" 
              alt="dev portrait" />
         </Box>
          <Text variant="regular" sx={{pt: 3}}>
            I'm a full stack web developer with a passion for helping businesses build 
            awesome solutions by using the latest web technologies. I'm a big fan of C# and
            ASP.NET Core, Javascript Frameworks, and Azure. I'm also
            a avid boulderer who currently lives in the beautiful city of Halifax.  
          </Text>
        </Box>
        <Box>
          <Themed.h2 sx={{
            mb: 3,
            color: "primary",
          }}>Skills</Themed.h2>
          <Text variant="regular" sx={{pt: 3}}>
            Skills are aquired through experience. I've been working with web technologies for over 5 years now.
            What I've learned is that skills are not static. They are constantly evolving and changing.
            I'm always learning new things and I'm always excited to learn more. Here are some of the skills I've aquired over the years.
          </Text>
          <Box sx={{
            border: '2px solid #eaeaea',
            mt: 3,
            borderRadius: '5px',
            backgroundColor: '#f8f8f8'
          }}>
            <BubbleCanvas skills={skills} />
          </Box>
        </Box>
    
        <Box sx={{ mt: 6, mb: 5 }}>
          <Themed.h1 sx={{
            mb: 3,
            color: "primary",
          }}>Services</Themed.h1>
          <Text variant="regular">
            Though I dedicate the grand magority of my time to the specific organization I work with
            I do take on the occasional freelance project. Get an estimate by selecting a project bellow or <a href="/contact">send me an email!</a> 
          </Text>
          <br/>
          <Text variant="regular">
            If the project is a website I often work closely with my friend and designer <a href="https://www.linkedin.com/in/paul-legere">Paul Legere</a>. Please check out his work!
          </Text>
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
                  If you have an idea please reach out! I'd love to work with you.
                </Text>
              </Box>
              <Box>
                <Link href="/contact">
                  <Button variant="secondary" sx={{ mt: 4 }} >
                    Contact Me
                    </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Layout >
  )
}

export default ServicesPage;