import React from 'react'
import Script from 'next/script'

export const CorrectTocScript = (url: string) => {
  return (
    <Script
      id={"CorrectTocScript" + new Date().getTime()}
      src={"/empty.js"}
      strategy="afterInteractive"
      onLoad={() => {
        var elems = document.querySelectorAll('h1,h2,h3,h4,h5,h6')
        for (var i = 0; i < elems.length; i++) {
          if (elems[i].getAttribute("scriptReady") == "true") continue;
          elems[i].setAttribute("scriptReady", "true")

          var tocDiv = document.createElement("div");
          tocDiv.setAttribute("id", elems[i].getAttribute("id") || "undefined");
          tocDiv.setAttribute("style", "position: relative; top: -80px;");
          elems[i].parentNode?.insertBefore(tocDiv, elems[i])
        }
      }}
    />
  )
}
