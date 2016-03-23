import React from 'react' 

export default () => {
  const license = `<div>
      <div class="text-muted">
        <p>
          <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">
            brittcrawford.com
          </span>
          <span class="hidden" xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">
            <a href="https://github.com/britt">britt</a>
          </span> is licensed under a 
          <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US">
            Creative Commons Attribution-ShareAlike 3.0 Unported License
          </a>
        </p>
      </div>
    </div>`

  return <footer className="container" dangerouslySetInnerHTML={{ __html: license }} />
}