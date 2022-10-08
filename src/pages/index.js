import React from 'react'
import Link from 'gatsby-link'

export default ({ route }) => {
  return (
    <main className='container'>
      <section className='introduction'>
        I live in Bend with my family. I build awesome stuff at <a href='http://www.strongdm.com'>StrongDM</a>. You can find me on the internet at:
      </section>
      <section className='list-of-links'>
        <ul>
          <li>
            <a href='https://twitter.com/britt' title='My Twitter Feed' rel='me'><i className='fab fa-twitter fa-fw' /><span>@britt</span></a>
          </li>
          <li>
            <a href='https://www.facebook.com/britt.crawford' title='My Facebook Profile' rel='me'><i className='fab fa-facebook fa-fw' /><span>https://www.facebook.com/britt.crawford</span></a>
          </li>
          <li>
            <a href='https://github.com/britt' title='GitHub' rel='me'><i className='fab fa-github-alt fa-fw' /><span>https://github.com/britt</span></a>
          </li>
          <li>
            <a href='http://www.linkedin.com/in/brittcrawford/' title='My LinkedIn Profile' rel='me'><i className='fab fa-linkedin fa-fw' /><span>https://www.linkedin.com/in/brittcrawford/</span></a>
          </li>
          <li>
            <a href='bitcoin:17nHbStzmWgcBEBSgVFT94Eo5hoq9h7Hh1' title='Bitcoin'><i className='fab fa-btc fa-fw' /><span>Bitcoin</span></a>
          </li>
          <li>
            <a href='/britt.gpg' title='PGP/GPG Public Key'><i className='fa fa-lock fa-fw' /><span>PGP/GPG Key</span></a> &mdash;&nbsp;
            <a href='http://pgp.mit.edu/pks/lookup?op=vindex&search=0x7C887E4EE58C84B3' title='MIT PGP Public Key Server'><span>MIT</span></a>
          </li>
        </ul>
      </section>
      <section className='list-of-links'>
        <h3>Projects</h3>
        <ul>
          <li>
            <Link to='/reading/'>
              What am I reading? 
            </Link>
            <summary>
              A weekly summary of articles that I have read and liked. <em>Dormant since November 2020.</em>
            </summary>
          </li>
          <li>
            <a href='https://github.com/britt/testivus' title='Testivus: let your code know how it disappoints you'>
              Testivus
            </a>
            <summary>
              A Go test helper library to let your code know how it disappoints you.
            </summary>
          </li>
          <li>
            <a title='Havamal' href='https://smile.amazon.com/Snugglebear-Team-Company-Havamal/dp/B07N114BWY/ref=sr_1_2?keywords=havamal&qid=1550960415&s=digital-skills&sr=1-2-catcorr'>
              Havamal
            </a>
            <summary>
              The wisdom of Odin, told by Alexa. Say, "Alexa tell me the wisdom of Odin."
            </summary>
          </li>
          <li>
            <Link to='/cocktails/'>
              Cocktail Recipes
            </Link>
            <summary>
              A small collection of cocktails that I've created.
            </summary>
          </li>
          <li>
            <Link to='/we_could_be_heroes.pdf'>
              We Could be Heroes, Just for One Day
            </Link>
            <summary>
              A free one-page roleplaying game where every player is David Bowie.
            </summary>
          </li>
          <li>
            <a href='https://github.com/britt/britt.github.com'>
              This site
            </a>
            <summary>
              The source code for <Link to='/'>brittcrawford.com</Link>. Look in
              the <a href='https://github.com/britt/britt.github.com'>master branch</a> for
              the deployed code, or in
              the <a href='https://github.com/britt/britt.github.com/tree/gatsby'>gatsby branch</a> to
              see the JavaScript and React that actually builds the static site.
              This site was built
              with <a href='https://github.com/gatsbyjs/gatsby'>Gatsby</a> and <a href='https://matejlatin.github.io/Gutenberg/'>Gutenberg</a>.
            </summary>
          </li>
        </ul>
      </section>
    </main>
  )
}
