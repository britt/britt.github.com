---
title: Love Dares Not
date: 2018-03-08
path: /daresnot/
---

## Dare Snot

Cory Doctorow's Walkaway, was my favorite novel of 2018. For a long time science fiction felt dated to me, everything I read felt stale. The real world had become far weirder and felt more futuristic. I've always particularly liked the sort of sci-fi that grapples with the big ideas. The sort that analyzes the hopes and anxieties of the present by telling stories about the future. Sometime in late 00s it felt like sci-fi gave up on these kinds of stories and settled for comfortable genre stories. It was like no one could properly integrate smartphones, ubiquitous mass surveillance, and the sheer weirdness of the current media environment into their storytelling. _(Except maybe Warren Ellis and Charlie Stross, but they had done it a decade earlier and moved on to other things.)_ Then I read Walkaway and it felt **new**. The book really gets hold of a big idea and wrestles it to the ground. 

* _How would society react if it were on the verge of material abundance?_
* _How would you build a new society if all things were fungible, if wealth as we know it, just didn't matter?_

In a way it also felt very old. It's like a modern version of [The Dispossessed](https://en.wikipedia.org/wiki/The_Dispossessed). Doctorow create his version of the Anarresti, the Walkaways. Walkaways secede from regular society and turn their back on it to find their own way of living in this world of material abundance. Walkaway culture is open source culture and maker culture, so it's philosophy is embodied more in tools than texts. These tools are described through out the book. One of them is Dare Snot, an anonymous voting system for controversial issues.

> The core idea was that radical or difficult ideas were held back by the thought that no one else had them. The fear of isolation led people to stay "in the closet" about their ideas, making them "the love that dare not speak its name". So lovedaresnot (shortened to "Dare Snot") gave you a way to find out if anyone else felt the same, without forcing you to out yourself.
>
> Anyone could put a question — a Snot Dare — up, like "Do you think we should turf that sexist asshole?" People who secretly agreed signed the question with a one time key that they didn't have to reveal until a pre-specified number of votes were on record. Then the system broadcast a message telling signers to come back with their signing keys and de-anonymize themselves, escrowing the results until a critical mass of signers had decloaked. Quick as you could say "I am Spartacus," consensus plopped out of the system.

I read this and thought, **"This is a terrible idea!"**.

* How do you stop people from shill voting?
  
  ```plaintext
  If somebody put up something I didn't like I'd just spam fake votes 
  to trigger the reveal message.
  ```

* Who generates the one-time key?
  
  ```plaintext
  If it's a central server, then wow, that's a huge incentive to pwn 
  that thing, or at least cheat and take a peak.
  ```

* What stops people from trolling and posting issues like:
  
  ```plaintext
  Who thinks Dave is fat and ugly and should just kill himself already?
  ```

* What if the voters don't come back to reveal their votes?
* *and so forth...*

Maybe it is a terrible idea. Maybe it's not. Maybe Cory's already thought about this. Maybe he's talked it through with folks that are smarter and more knowledgable than me like security experts and cryptographers. **Maybe the version in the book is incomplete because it's a novel, not a paper on voting systems.**

So, I decided to treat it as charitably as possible. I'll assume it works and try to figure out how it could work. It will be a fun challenge. _(**Aside**: One of the my favorite examples of this exercise is [Goblins, the Fungal Body Politic](https://www.maxgladstone.com/2014/10/goblins-the-fungal-body-politic/). Goblins only make sense if they are a fungus.)_ So here I go, doing something you really shouldn't do, trying to design my own secure protocols. It's not rolling your own crypto bad, but it's definite land war in Asia territory.

![Vizzini in the battle of wits](/img/vizzini_battle_of_wits.png)

### DISCLAIMERS

1. I am not a cryptography expert.
2. There is no implementation yet. 
3. It has only been attacked and debugged in conversations with a few other people and in my own head.
4. **I purposefully did not search for an existing solution** in the literature. I was more interested in the puzzle than using the end product. So, if I propose something that someone else has already thought of just tell me. I'll be happy to hear it. It means I'm on the right track.
5. I purposefully avoided homomorphic encryption because I don't understand it well enough to know how using it might affect verifiability.

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

#### As described in the novel

1. An issue to be voted upon is declared. It is a yes/no proposition.
2. Voters who agree with the proposition generate a one-time symmetric encryption key.
3. They then generate a digital signature using a known public/private key pair. That they've registered with a key server or otherwise claimed as identifying them.
4. They encrypt this signature with the public key they generated in step #2.
5. They post this key to the server.
6. They monitor the issue and watch for the signal to decloak.
7. When the signal is sent they transmit their one-time key to the server.
8. The server waits until a sufficient number of keys have been received, then reveals the votes.

##### Limitations

* Only yes/no propositions can be voted on.

##### Flaws

* Shill attack
* pwning the server
* Reliance on voter OpSec

## TODO: Transcibe new protocols here

### Related Reading

* [Helios: Web-based Open-Audit Voting by Ben Adida](https://www.usenix.org/legacy/events/sec08/tech/full_papers/adida/adida.pdf)
* [Explain Like I’m 5: Zero Knowledge Proof (Halloween Edition)](https://hackernoon.com/eli5-zero-knowledge-proof-78a276db9eff)
* [Explain Like I’m 5: Zero Knowledge Proof (Halloween Edition)](http://twistedoakstudios.com/blog/Post3724_explain-it-like-im-five-the-socialist-millionaire-problem-and-secure-multi-party-computation)
* [zkSnarks in a Nutshell](https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell/)
* [Secret Sharing Homomorphism and Secure E-voting](https://arxiv.org/pdf/1602.05372.pdf)
* Lots of Wikipedia but particularly
  * [Homomorphic Encryption](https://en.wikipedia.org/wiki/Homomorphic_encryption)
  * [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_Secret_Sharing)
  * [Yao's Millionaires' Problem](https://en.wikipedia.org/wiki/Yao%27s_Millionaires%27_Problem)
* [Yao’s Millionaires’ Problem and Public-Key Encryption Without Computational Assumptions](https://www.worldscientific.com/doi/abs/10.1142/S012905411750023X)
* [Degrees of Freedom by Karl Schroeder](http://hieroglyph.asu.edu/story/degrees-of-freedom/)