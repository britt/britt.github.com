import React from 'react'
import { Link } from 'react-router'
import { link } from 'gatsby-helpers'

// Styles for highlighted code blocks.
import 'css/base.css'

export default class Sass extends React.Component {
  render () {
    return (
      <div class="container vcard">
         <p class="introduction">Hi, I'm <strong><a class="url fn" href="http://brittcrawford.com" rel="home author" title="my site">Britt Crawford</a></strong>. I live in San Francisco with my family. I've been a researcher, programmer, and low limit poker grinder. Currently I run analytics at <a href="https://rafter.com" title="Rafter, the place where I work" class="work">Rafter</a>. You can find me on the internet at:</p>
        <ul class="list-of-links lead">
          <li>
            <a href="https://twitter.com/britt" title="My Twitter Feed" rel="me"><i class="fa fa-my-twitter fa-fw"></i><span>@britt</span></a>
          </li>
          <li>
            <a href="https://www.facebook.com/britt.crawford" title="My Facebook Profile" rel="me"><i class="fa fa-my-facebook fa-fw"></i><span>https://www.facebook.com/britt.crawford</span></a>
          </li>
          <li>
            <a href="http://www.linkedin.com/in/brittcrawford/" title="My LinkedIn Profile" rel="me"><i class="fa fa-my-linkedin fa-fw"></i><span>http://www.linkedin.com/in/brittcrawford/</span></a>
          </li> 
          <li>
            <a href="https://github.com/britt" title="GitHub" rel="me"><i class="fa fa-github-alt fa-fw"></i><span>https://github.com/britt</span></a>
          </li> 
          <li>
            <a href="http://illtemper.org" data-toggle="tooltip" data-placement="right" title="A stream of consciousness link blog"><i class="fa fa-link fa-fw"></i><span>http://illtemper.org</span></a>
          </li> 
          <li>
            <a href="bitcoin:17nHbStzmWgcBEBSgVFT94Eo5hoq9h7Hh1" title="Bitcoin"><i class="fa fa-bitcoin fa-fw"></i><span>Bitcoin</span></a>
          </li> 
          <li>
            <a href="/britt.gpg" title="PGP/GPG Public Key"><i class="fa fa-lock fa-fw"></i><span>PGP/GPG Key</span></a> ::: 
            <a href="https://keybase.io/britt" title="Keybase"><span>Keybase</span></a> ::: 
            <a href="http://pgp.mit.edu/pks/lookup?op=vindex&search=0x7C887E4EE58C84B3" title="MIT PGP Public Key Server"><span>MIT</span></a>
          </li>                                                       
        </ul>
      </div>
    )
  }
}
