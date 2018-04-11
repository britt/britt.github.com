---
title: Love Dares Not
date: 2018-03-08
path: /daresnot/
draft: true
---

## Dare Snot

Cory Doctorow's Walkaway, is so far my favorite novel of the year. For a long time science fiction has felt outmoded to me. The sort of science fiction I like has always been about grappling with the big ideas and big anxieties of the present by telling stories about the future. Sometime in late aughts I felt like as a genre it gave up on these kinds of stories and settled for telling comfortable genre stories. It was like no one could properly integrate smartphones, ubiquitous mass surveillance, and the sheer weirdness of the current media environment into their storytelling. _(Except maybe Warren Ellis and Charlie Stross, but they did it a decade earlier and moved on to other things.)_ Then I read Walkaway and it felt new. It really gets hold of a big idea, _How would society react if it were on the verge of material abundance?_, and wrestles with it.

---
**Need a segue**

Walkaway culture is a maker culture so it's philosophy is embodied more in tools than texts. These tools are described through out the book. One of them is Dare Snot, an anonymous voting system for controversial issues.

---

> The core idea was that radical or difficult ideas were held back by the thought that no one else had them. The fear of isolation led people to stay "in the closet" about their ideas, making them "the love that dare not speak its name". So lovedaresnot (shortened to "Dare Snot") gave you a way to find out if anyone else felt the same, without forcing you to out yourself.
>
> Anyone could put a question — a Snot Dare — up, like "Do you think we should turf that sexist asshole?" People who secretly agreed signed the question with a one time key that they didn't have to reveal until a pre-specified number of votes were on record. Then the system broadcast a message telling signers to come back with their signing keys and de-anonymize themselves, escrowing the results until a critical mass of signers had decloaked. Quick as you could say "I am Spartacus," consensus plopped out of the system.

I read this and thought...

* That'll never work. How do you stop people from shill voting? If somebody put up something I didn't like I'd just spam fake votes to trigger the reveal message.
* Who generates the one-time key? If it's a central server, then wow, there's a big incentive to pwn that thing.
* What stops people from posting issues like, _"Who thinks Dave is fat and ugly and should just kill himself already?"_
* and so forth...

But Cory Doctorow is a smart guy. He's probably thought of some of this, and he has probably talked it through with folks that are smarter and more knowledgable than me. Maybe the version in the book is incomplete because it's a novel, not a paper on voting systems. I decided to treat it as charitably as possible. Assume it works and try to figure out how it could work.

_(Authors and fans sometimes do this with beloved but ... inconsistent media. Assume that the plotholes are intentional and come up with a narrative that makes sense of them. My favorite example is [Goblins, the Fungal Body Politic](https://www.maxgladstone.com/2014/10/goblins-the-fungal-body-politic/). Goblins are a fungus.)_

This is also the sort of puzzle I like. So much so that it lured me into doing something you really shouldn't do, trying to design your own secure protocols. It's not as bad as trying to roll your own crypto, but it's a great way to make a fool of yourself. Definite land war in Asia territory.

![Vizzini in the battle of wits](/img/vizzini_battle_of_wits.png)

**DISCLAIMERS:**

1. I am not a security expert.
2. There is no implementation yet. It has only been attacked and debugging in conversations with a few other people and in my own head.
3. **I purposefully did not search for an existing solution** in the literature. I was more interested in the puzzle than using the end product. So, if I propose something that someone else has already thought of just tell me. I'll be happy to hear it. It means I'm on the right track.
4. I purposefully avoided homomorphic encryption because I don't understand it well enough to know how using it might affect verifiability.

### Requirements

* Arbitrary consensus calculation, not everyone has to vote.
* Proof against arbiter defection
* Proof against voter defection
  * Lying about votes
  * Failing to reveal votes

### Limitations of original formulation

* Binary questions
* Voter defection
  * not deanonymizing
  * voting multiple times
* How can you trust the central system?

### Attack Vectors

* Walking the social graph
* Timing
* Arbiter snooping

### Protocol

#### 100% Quorum

* An issue is declared and options for voting are set.
* The voter generates a random nonce for each action
* The voter encrypts the set of nonces, signs it and posts it publicly along with their vote in plaintext.
* Once everyone votes it is announced that voting is complete.
* Voters decrypt their votes.

## TODO: Transcibe new protocols here

### Related Reading

* [Degrees of Freedom by Karl Schroeder](http://hieroglyph.asu.edu/story/degrees-of-freedom/)