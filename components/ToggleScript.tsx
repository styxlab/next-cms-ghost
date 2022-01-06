import React from 'react'
import Script from 'next/script'

export const ToggleScript = () => {
  return (
    <Script
      id={"toggleScript" + new Date().getTime()}
      src={"/empty.js"}
      strategy="lazyOnload"
      onLoad={() => {
        var coll = document.getElementsByClassName("kg-toggle-card");
        for (var i = 0; i < coll.length; i++) {
          var elem = coll[i];
          if (elem.getAttribute("scriptReady") == "true") continue;
          elem.setAttribute("scriptReady", "true")

          elem.addEventListener("click", function() {
            if (elem?.getAttribute('data-kg-toggle-state') == 'close')
              elem.setAttribute('data-kg-toggle-state', 'open')
            else
              elem?.setAttribute('data-kg-toggle-state', 'close')
          });
        }
      }}
    />
  )
}
