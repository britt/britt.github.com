import React from 'react'
import VCard from 'components/vcard'
import 'css/base.scss'

export default ({route}) => {
  console.log(route.page.data)

  return (
    <VCard className="container">
      <div className="greeting">
        Hi, I'm <a className="url fn" href="http://brittcrawford.com" 
            rel="home author" title="my site">
            Britt Crawford
          </a>
      </div>
      <div className="container">
        <div className="introduction">
          I live in San Francisco with my family. I've been a researcher, 
          programmer, and low limit poker grinder. Currently I run analytics at <a href="https://rafter.com" title="Rafter, the place where I work" className="work">Rafter</a>. 
          You can find me on the internet at:
        </div>
        <div className="list-of-links">
          <ul>
            <li>
              <a href="https://twitter.com/britt" title="My Twitter Feed" rel="me"><i className="fa fa-twitter fa-fw"></i><span>@britt</span></a>
            </li>
            <li>
              <a href="https://www.facebook.com/britt.crawford" title="My Facebook Profile" rel="me"><i className="fa fa-facebook fa-fw"></i><span>https://www.facebook.com/britt.crawford</span></a>
            </li>
            <li>
              <a href="http://www.linkedin.com/in/brittcrawford/" title="My LinkedIn Profile" rel="me"><i className="fa fa-linkedin fa-fw"></i><span>http://www.linkedin.com/in/brittcrawford/</span></a>
            </li> 
            <li>
              <a href="https://github.com/britt" title="GitHub" rel="me"><i className="fa fa-github-alt fa-fw"></i><span>https://github.com/britt</span></a>
            </li> 
            <li>
              <a href="http://illtemper.org" title="A stream of consciousness link blog"><i className="fa fa-link fa-fw"></i><span>http://illtemper.org</span></a>
            </li> 
            <li>
              <a href="bitcoin:17nHbStzmWgcBEBSgVFT94Eo5hoq9h7Hh1" title="Bitcoin"><i className="fa fa-bitcoin fa-fw"></i><span>Bitcoin</span></a>
            </li> 
            <li>
              <a href="/britt.gpg" title="PGP/GPG Public Key"><i className="fa fa-lock fa-fw"></i><span>PGP/GPG Key</span></a> ::: 
              <a href="https://keybase.io/britt" title="Keybase"><span>Keybase</span></a> ::: 
              <a href="http://pgp.mit.edu/pks/lookup?op=vindex&search=0x7C887E4EE58C84B3" title="MIT PGP Public Key Server"><span>MIT</span></a>
            </li>                                                       
          </ul>
        </div>
      </div>
    </VCard>
  )
}
