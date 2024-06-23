import * as React from "react"
import { Link } from "gatsby"

// markup
const NotFoundPage = () => {
  return (
    <main>
      <h1>Oups! This page does not exist!</h1>
      <Link href="/">Go Back Home</Link>
    </main>
  )
}

export default NotFoundPage
