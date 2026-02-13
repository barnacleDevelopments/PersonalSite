/** @jsx jsx */
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link as GatsbyLink } from "gatsby";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Link,
  Paragraph,
  Text,
  Textarea,
} from "theme-ui";
import * as yup from "yup";

import PageLoader from "../components/PageLoader/PageLoader";
import Seo from "../components/Seo/Seo";

const SubmitFailed = () => (
  <Flex
    sx={{
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Box textAlign="center">
      <h2>Oups!</h2>
      <Text variant="regular" sx={{ my: 3, display: "block" }}>
        We couldn't send your email.
      </Text>
      <GatsbyLink to="/contact">
        <Button>Try Again</Button>
      </GatsbyLink>
    </Box>
  </Flex>
);

const SubmitSuccess = () => {
  const copyPGP = useCallback(async () => {
    const response = await fetch("/pgp-key.asc");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const text = await response.text();

    navigator.clipboard.writeText(text);
  }, []);

  return (
    <Flex
      sx={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Box textAlign="center">
        <Heading variant="large" sx={{ mb: 3 }}>
          Thank you for the email!
        </Heading>
        <Text variant="regular" sx={{ my: 3, display: "block" }}>
          {" "}
          I'll be in touch with you shortly.
        </Text>
        <Flex sx={{ gap: 3, alignItems: "center", mb: 3 }}>
          <Box>
            {"Copy my public PGP key to ensure I can securely email you."}{" "}
            <Link
              variant="text"
              href="https://www.fortinet.com/resources/cyberglossary/pgp-encryption"
            >
              Learn more about PGP
            </Link>{" "}
          </Box>
        </Flex>
        <Button variant="secondary" sx={{ mr: 2 }}>
          <Text>Copy PGP</Text>
          <Icon
            onClick={copyPGP}
            sx={{
              ml: 2,
            }}
            icon={faCopy}
          />
        </Button>
        <GatsbyLink to="/">
          <Button variant="primary">Back Home</Button>
        </GatsbyLink>
      </Box>
    </Flex>
  );
};

const ContactPage = () => {
  const [isPostSuccessful, setIsPostSuccessful] = useState(false);
  const [isFormHighlighted, setIsFormHighlighted] = useState(false);
  const schema = useMemo(
    () =>
      yup
        .object({
          email: yup.string().email().required(),
          subject: yup.string().min(1).max(40).required(),
          message: yup.string().min(1).max(5000).required(),
        })
        .required(),
    [],
  );

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting, isSubmitted, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const highlightContactForm = useCallback(() => {
    setFocus("email");
    setIsFormHighlighted(true);
    window.scrollTo(0, 200);
  }, [setFocus]);

  const onSubmit = useCallback(async (data) => {
    const encode = (formData) => {
      return Object.keys(formData)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(formData[key])}`,
        )
        .join("&");
    };

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
  }, []);

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  return (
    <Box>
      <Seo
        title="Contact"
        description="Contact Devin Davis, a Full Stack Web Developer. Discuss your project or collaborate today. Open to freelance and full-time roles!"
        keywords={[
          "Full Stack Web Developer",
          "Devin S. Davis",
          "Contact Devin S. Davis",
          "Freelance Developer",
          "Contractor",
          "Full-Time Developer Opportunities",
          "Web Development Services",
          "Innovative Web Technologies",
          "Collaborate on Projects",
          "Hire a Web Developer",
          "Technical Solutions Expert",
          "Custom Web Solutions",
          "Web Developer Portfolio",
        ]}
      />
      <Box
        sx={{
          width: ["90%", "80%", "70%"],
          mx: "auto",
          my: 5,
        }}
      >
        {!isSubmitted && (
          <Box
            sx={{
              margin: "0 auto",
              mb: 4,
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
              sx={{
                border: isFormHighlighted ? "3px solid orange" : "none",
                borderRadius: 5,
                p: isFormHighlighted ? 3 : 0,
              }}
            >
              <Box
                as="form"
                action="/contact"
                name="Contact Form"
                method="POST"
                data-netlify="true"
                id="contact-form"
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
                      {errors.email.message}
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
                      {errors.subject.message}
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
                  />
                  {errors.message && (
                    <Text sx={{ color: "red", mb: 3, display: "block" }}>
                      {errors.message.message}
                    </Text>
                  )}
                </Box>
                <Button
                  sx={{ flexShrink: 0 }}
                  variant="primary"
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  disabled={!isValid}
                >
                  SEND
                </Button>
              </Box>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Paragraph>
                I'm a{" "}
                <GatsbyLink
                  to="/about"
                  sx={{
                    color: "blue",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#E07A5F",
                      textDecoration: "underline",
                    },
                  }}
                >
                  results-oriented Full Stack Web Developer
                </GatsbyLink>
                . Whether you have a project idea, need a technical
                collaborator, or just want to connect, I’d love to hear from
                you. Connect with me on{" "}
                <Link
                  variant="text"
                  target="_blank"
                  href="https://www.linkedin.com/in/devin-dev-d-63008412b"
                >
                  LinkedIn
                </Link>{" "}
                or use my{" "}
                <Link
                  sx={{
                    color: "blue",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                  onClick={highlightContactForm}
                >
                  contact form
                </Link>
                —I’ll get back to you shortly.
              </Paragraph>
              <Heading variant="subheading2" sx={{ mt: 3 }}>
                Availability
              </Heading>
              <Paragraph>
                I’m currently open to new opportunities! Whether you need a
                freelance developer to bring your project to life or a full-time
                professional to join your team, let’s connect.
              </Paragraph>
              <Heading variant="subheading2" sx={{ mt: 3 }}>
                Check Out My Work
              </Heading>
              <Paragraph>
                Explore how I’ve helped businesses and teams bring their ideas
                to life. My portfolio highlights my versatility and commitment
                to delivering high-quality results.{" "}
                <GatsbyLink
                  to="/projects"
                  sx={{
                    color: "blue",
                    fontWeight: "bold",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#E07A5F",
                      textDecoration: "underline",
                    },
                  }}
                >
                  View my portfolio
                </GatsbyLink>{" "}
                and reach out to discuss your next project!
              </Paragraph>
            </Box>
          </Grid>
        )}
        {isSubmitting && !isPostSuccessful && <PageLoader />}
        {isPostSuccessful && <SubmitSuccess />}
        {!isPostSuccessful && isSubmitted && <SubmitFailed />}
      </Box>
    </Box>
  );
};

export default ContactPage;
