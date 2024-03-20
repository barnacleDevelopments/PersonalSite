/** @jsx jsx */
import { jsx } from "theme-ui";
import { useState } from "react";
import "react-picky/dist/picky.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CSSTransition } from "react-transition-group";

// Components
import { Box, Flex, Text, Label, Input, Textarea, Button } from "theme-ui";
import { Picky } from "react-picky";
import OrderForm from "./OrderForm";

import Loader from "../Loader";

const schema = yup
  .object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    notes: yup.string(),
  })
  .required();

const BasicEstimateForm = ({ onClose }) => {
  const [formContents, setFormContent] = useState({
    pageCount: 5,
    languages: ["english"],
  });
  const [orderMenuStatus, setOrderMenuStatus] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  const [loaderStatus, setLoaderStatus] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function prepareOrder(estimate) {
    setLoaderStatus(false);
    setCurrentOrder(estimate);
    setOrderMenuStatus(true);
  }

  function handleLanguageSelect(values) {
    let formContent = formContents;
    formContent.languages = values;
    setFormContent({ ...formContent });
  }

  function handlePageCountSelect(value) {
    let formContent = formContents;
    formContent.pageCount = value;
    setFormContent({ ...formContent });
  }

  function onSubmit(data) {
    const formContent = { ...data, ...formContents };
    setLoaderStatus(true);
    setTimeout(() => {
      fetch("/.netlify/functions/retrieve_estimate", {
        method: "POST",
        body: JSON.stringify(formContent),
      })
        .then((response) => response.json())
        .then((data) => prepareOrder(data))
        .catch((error) => console.log("Oups: ", error));
    }, 3000);
  }

  return (
    <CSSTransition in={orderMenuStatus} timeout={100} classNames="estimate">
      {orderMenuStatus ? (
        <Box>
          <OrderForm estimate={currentOrder} onClose={onClose} />
        </Box>
      ) : loaderStatus ? (
        <Loader />
      ) : (
        <Box
          sx={{
            bg: "secondary",
            width: ["100%", "100%", "100%", "70%"],
            height: ["100%", "100%", "100%", "100%"],
          }}
        >
          <Box
            sx={{
              bg: "primary",
              textTransform: "uppercase",
              color: "white",
              p: 3,
            }}
          >
            <h2 sx={{ fontSize: [1] }}>Estimate Form</h2>
          </Box>
          <Box
            as="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{
              ml: [3],
              mb: 4,
              color: "black",
              height: "calc(100% - 80px)",
              overflowY: "scroll",
              scrollbarWidth: "1rem",
            }}
          >
            <fieldset className="personal-info">
              <h4 sx={{ mb: 2 }}>Personal Info</h4>
              <Box sx={{ ml: 2 }}>
                <Box sx={{ mb: 2 }}>
                  <Input
                    sx={{ mb: 2 }}
                    {...register("firstName", { required: true })}
                    type="text"
                    placeholder="First Name..."
                  />
                  {errors.firstName?.message && (
                    <Text sx={{ color: "red" }}>First name is required.</Text>
                  )}
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Input
                    sx={{ mb: 2 }}
                    {...register("lastName", { required: true })}
                    type="text"
                    placeholder="Last Name..."
                  />
                  {errors.lastName?.message && (
                    <Text sx={{ color: "red" }}>Last name is required.</Text>
                  )}
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Input
                    sx={{ mb: 2 }}
                    {...register("email", { required: true })}
                    type="text"
                    placeholder="Email Address..."
                  />
                  {errors.email?.message && (
                    <Text sx={{ color: "red" }}>Must be a valid email.</Text>
                  )}
                </Box>
              </Box>
            </fieldset>
            <fieldset>
              <h4 sx={{ mb: 3, mt: 2 }}>Website Info</h4>
              <Box sx={{ ml: 2 }}>
                <Box>
                  <Label>Page Count:</Label>
                  <Picky
                    buttonProps={{
                      style: { marginTop: 10, marginBottom: 15 },
                    }}
                    id="picky-pages"
                    options={[5, 6, 7, 8, 9, 10]}
                    value={formContents.pageCount}
                    onChange={handlePageCountSelect}
                    dropdownHeight={600}
                  />
                </Box>
                <Box>
                  <Label>Languages:</Label>
                  <Picky
                    buttonProps={{
                      style: { marginTop: 10, marginBottom: 15 },
                    }}
                    id="picky-languages"
                    options={["english", "french"]}
                    value={formContents.languages}
                    multiple={true}
                    onChange={handleLanguageSelect}
                    dropdownHeight={600}
                  />
                </Box>
                <Flex sx={{ mb: 3 }}>
                  <input
                    id="hasContactForm"
                    {...register("hasContactForm")}
                    type="checkbox"
                  />
                  <Label>Contact Form</Label>
                </Flex>
                <Flex sx={{ mb: 3 }}>
                  <input id="hasSEO" {...register("hasSEO")} type="checkbox" />
                  <Label>Search Engine Optimization (SEO)</Label>
                </Flex>
                <Flex sx={{ mb: 3 }}>
                  <input id="hasCMS" {...register("hasCMS")} type="checkbox" />
                  <Label>Content Mangement System (CMS)</Label>
                </Flex>
                <Box sx={{ mb: 3 }}>
                  <Label sx={{ mb: 2 }}>Notes: </Label>
                  <Textarea
                    sx={{ resize: "vertical" }}
                    id="notes"
                    {...register("notes")}
                    type="text"
                  />
                </Box>
              </Box>
            </fieldset>
            <Box sx={{ mb: 3 }}>
              <Button sx={{ mr: 2 }} variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSubmit(onSubmit)}>
                Get Estimate
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </CSSTransition>
  );
};

export default BasicEstimateForm;
