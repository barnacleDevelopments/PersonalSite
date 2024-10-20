/** @jsx jsx */
import { jsx } from "theme-ui";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Hooks
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

// Components
import {
  Box,
  Grid,
  Flex,
  Button,
  Heading,
  Text,
  Input,
  Textarea,
  Link,
  Paragraph,
} from "theme-ui";
import Loader from "../components/Loader";
import Seo from "../components/app/Seo";

const schema = yup
  .object({
    email: yup.string().email().required(),
    subject: yup.string().min(1).max(40).required(),
    message: yup.string().min(1).max(5000).required(),
  })
  .required();

const ContactPage = () => {
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting, isSubmitted, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    setFocus("email");
  }, []);

  function encode(data) {
    return Object.keys(data)
      .map(
        (key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]),
      )
      .join("&");
  }

  const onSubmit = async (data) => {
    const response = await fetch("/contact", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": "Contact Form",
        ...data,
      }),
    });

    if (response.ok) {
      setIsPostSuccessful(true);
    }
  };

  return (
    <Box>
      <Seo title="Contact" />
      <Box
        sx={{
          width: ["90%", "80%", "70%"],
          mx: "auto",
          my: 6,
        }}
      >
        {!isSubmitted && (
          <Box
            sx={{
              margin: "0 auto",
              mt: 6,
            }}
          >
            <Heading as="h1" variant="hero">
              Let's Talk About You
            </Heading>
            <Paragraph sx={{ my: 3, display: "block" }} variant="large">
              Please reach out. I'd love to help you reach your goals!
            </Paragraph>
          </Box>
        )}

        {(!isSubmitted || !isValid) && (
          <Grid gap={3} columns={["1fr", "1fr 1fr", "1.5fr 2fr"]}>
            <Box
              as="form"
              action="/contact"
              name="Contact Form"
              method="POST"
              data-netlify="true"
            >
              <Input
                variant="primary"
                sx={{ mb: 3, bg: "secondary" }}
                type="hidden"
                name="form-name"
                value="Contact Form"
              />
              <Box>
                <Input
                  sx={{
                    mb: 3,
                    bg: "primary",
                    color: "secondary",
                    border: "none",
                    p: 3,
                  }}
                  name="email"
                  {...register("email")}
                  type="text"
                  placeholder="Email Address..."
                />
                {errors.email && (
                  <Text sx={{ color: "red", mb: 3, display: "block" }}>
                    {errors.email?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Input
                  sx={{
                    mb: 3,
                    bg: "primary",
                    color: "secondary",
                    border: "none",
                    p: 3,
                  }}
                  name="subject"
                  {...register("subject")}
                  type="text"
                  placeholder="Subject..."
                />
                {errors.subject && (
                  <Text sx={{ color: "red", mb: 3, display: "block" }}>
                    {errors.subject?.message}
                  </Text>
                )}
              </Box>
              <Box>
                <Textarea
                  sx={{
                    mb: 3,
                    bg: "primary",
                    color: "secondary",
                    border: "none",
                    p: 3,
                    fontFamily: "roboto",
                    minHeight: "300px",
                    resize: "vertical",
                  }}
                  name="message"
                  {...register("message")}
                  type="text"
                  placeholder="Message..."
                ></Textarea>
                {errors.message && (
                  <Text sx={{ color: "red", mb: 3, display: "block" }}>
                    {errors.message?.message}
                  </Text>
                )}
              </Box>
              <Button
                variant="primary"
                onClick={handleSubmit(onSubmit)}
                type="submit"
                disabled={!isValid}
              >
                send
              </Button>
            </Box>
            <Box>
              <Box sx={{ mb: 3 }}>
                <Heading as="h2" variant="secondary">
                  Info
                </Heading>
                <Box sx={{ mb: 3 }}>
                  <strong>Web3 Jobs Profile: </strong>
                  <a href="https://web3.career/@devdeveloper">
                    https://web3.career/@devdeveloper
                  </a>
                </Box>
                <Box>
                  <strong>Linkdin Profile: </strong>
                  <a href="https://www.linkedin.com/in/devin-dev-d-63008412b">
                    https://www.linkedin.com/in/devin-dev-d-63008412b
                  </a>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
        {isSubmitting && !isPostSuccessful && (
          <Flex
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Loader />
          </Flex>
        )}
        {isPostSuccessful && (
          <Flex
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box textAlign="center">
              <h2 sx={{ mb: 3 }}>Thank you for the email!</h2>
              <Text variant="regular" sx={{ my: 3, display: "block" }}>
                {" "}
                I'll be in touch with you shortly.
              </Text>
              <Link href="/">
                <Button>Back Home</Button>
              </Link>
            </Box>
          </Flex>
        )}
        {!isPostSuccessful && isSubmitted && (
          <Flex
            sx={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box textAlign="center">
              <h2 sx={{ mb: 3 }}>Oups!</h2>
              <Text variant="regular" sx={{ my: 3, display: "block" }}>
                We couldn't send your email.
              </Text>
              <Link href="/contact">
                <Button>Try Again</Button>
              </Link>
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default ContactPage;
