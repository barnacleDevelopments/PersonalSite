/** @jsx jsx */
import { jsx } from "theme-ui"
import { Flex } from '@theme-ui/components'
import { useEffect } from 'react'

function ProjectAdd() {

  useEffect(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <Flex sx={{ justifyContent: "center" }}>
      <ins className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client="ca-pub-8182705127562776"
        data-ad-slot="8736405457"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </Flex>
  )
}

export default ProjectAdd;