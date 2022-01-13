import * as React from "react"
import { useState } from "react"
import { Picky } from 'react-picky';
import 'react-picky/dist/picky.css'; // Include CSS

const EComEstimateForm = ({ close }) => {
  const [formContents, setFormContent] = useState({});
  const [languages, setLanguages] = useState([]);
  const [pageCount, setPageCount] = useState(1);

  const handleChange = (event) => {
    let formContent = formContents;

    switch (event.target.name) {
      case "seo":
        event.target.checked ? formContent.seo = true : formContent.seo = false;
        break;
      case "productCount":
        event.target.checked ? formContent.productCount = true : formContent.productCount = false;
        break;
      default:
        formContent[event.target.name] = event.target.value;
        break;
    }
    setFormContent(formContent)
  }

  const handleLanguageSelect = (values) => {
    let formContent = formContents;
    formContent.languages = values;
    setLanguages(values);
  }

  const handlePageCountSelect = (value) => {
    let formContent = formContents;
    formContent.pageCount = value;
    setPageCount(value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("/.netlify/functions/retrieve_estimate", {
      method: "POST",
      body: JSON.stringify(formContents)
    }).then(close);
  }

  return (
    <form className="estimate-form" onSubmit={handleSubmit}>
      <div>
        <input type="text" name="firstName" placeholder="First Name..." onChange={handleChange} />
      </div>
      <div>
        <input type="text" name="lastName" placeholder="Last Name..." onChange={handleChange} />
      </div>
      <div>
        <input type="text" name="email" placeholder="Email Address..." onChange={handleChange} />
      </div>
      <div>
        <Picky
          id="picky"
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          value={pageCount}
          onChange={handlePageCountSelect}
          dropdownHeight={600}
        />
      </div>
      <div>
        <Picky
          id="picky"
          options={["english", "french"]}
          value={languages}
          multiple={true}
          onChange={handleLanguageSelect}
          dropdownHeight={600}
        />
      </div>
      <div>
        <input type="checkbox" name="productCount" onChange={handleChange} />
        <label for="productCount">Is product count above 100000?</label>
      </div>
      <div>
        <input type="checkbox" name="seo" onChange={handleChange} />
        <label for="seo">Search Engine Optimization (SEO)</label>
      </div>
      <input value="Get Estimate" type="submit" />
    </form>

  )
}

export default EComEstimateForm;