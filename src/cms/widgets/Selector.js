import React, { useEffect } from "react";
import { Select } from "theme-ui"

export function SelectorControl(props) {
  const options = props.field._root.entries.find((o) => {
    return o[0] === "options"
  })[1].split(",").map(o => o.trim());

  useEffect(() => {
    console.log(props.value)
    console.log(options)
    if (!props.value) props.onChange(options[0])
  }, []);

  function handleChange(value) {
    props.onChange(value.target.value);
  }

  return (
    <Select sx={{ display: "block" }} defaultValue={props.value ? props.value : options[0]} onChange={value => handleChange(value)}>
      {options.map((o) => <option value={o}>{o}</option>)}
    </Select>
  );
}

export const SelectorPreview = ({ value }) => <div>{value}</div>;