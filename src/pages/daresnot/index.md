---
title: Love Dares Not
date: 2018-03-08
path: /daresnot/
draft: true
---

## Dare Snot

Cory Doctorow's Walkaway, is so far my favorite book of the year. For a long time science fiction has felt outmoded to me. As a genre science fiction has always been about grappling with the big ideas and big anxieties of the present by telling stories about the future. Sometime in late aughts I feel like it gave up and devolved into comfortably rehashing the big ideas of the past. Walkaway was the first sci-fi novel I've read in a long time that felt current. It really gets hold of a big idea, abundance, and wrestles with it.

_How would society react if it were on the verge of material abundance?_

* more about the book

Walkaway culture is a maker culture so it's philosophy is embodied more in tools than texts. One that caught my imagination was Dare Snot, an anonymous voting system for controversial issues.

> The core idea was that radical or difficult ideas were held back by the thought that no one else had them. The fear of isolation led people to stay "in the closet" about their ideas, making them "the love that dare not speak its name". So lovedaresnot (shortened to "Dare Snot") gave you a way to find out if anyone else felt the same, without forcing you to out yourself.
>
> Anyone could put a question — a Snot Dare — up, like "Do you think we should turf that sexist asshole?" People who secretly agreed signed the question with a one time key that they didn't have to reveal until a pre-specified number of votes were on record. Then the system broadcast a message telling signers to come back with their signing keys and de-anonymize themselves, escrowing the results until a critical mass of signers had decloaked. Quick as you could say "I am Spartacus," consensus plopped out of the system.

It's the sort of puzzle I like. So much so that it lured me into doing something you really shouldn't do, trying to design your own secure protocols. It's not as bad as trying to roll your own crypto, but it's a good way to make a fool of yourself.

* Something you shouldn't do, design your own protocol.
* Didn't use homomorphic encryption, because I don't understand it well enough.

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

#### Arbitrary Consensus

1. An issue is declared and options for voting are set. A set of eligible voters is also declared, identified by their public keys.
2. The voter generates a random nonce for each action
3. The voter then hashes the nonce corresponding to their vote. They also generate a map of all the options and the hash of the nonce corresponding to each option.
4. The voter sends the hash of their vote along with the option list to the arbiter.
5. The arbiter records the vote and the current state of the issue.
6. The arbiter sends a digitally signed hash of the vote state to the voter.
7. The voter encrypts a message containing: the nonce representing their vote (not hashed), the option map (again not hashed), the hash of the vote state provided by the arbiter. They sign it and post it to an immutable ledger like the Ethereum blockchain. _Signing establishes voter identity and protects against double voting. Last vote wins._
8. When a decision is reached the arbiter announces it and reveals the chain of votes.
9. Voters decrypt.
10. Once sufficient results are decrypted to justify the decision the decision is confirmed.

This version is safe against the network attack but not against arbiter snooping.

Hiding the meaning of the votes from the arbiter could work but that would require all voters to decrypt to verify.

Voters can be identified via timing analysis even if they choose not to decrypt. Further the state of the vote can be verified at any step since it is encoded by both the arbiter and the voters.

If you can successfully conceal your identity from the arbiter then your identity remains secret until voting is complete. This is competed by using a tamper proof record of the proof like a blockchain. You would also need to delay your posting of your proof to prevent a timing attack by the arbiter.

**Crap!** You can vote multiple times, and thus poison the consensus or force early revelation. Verifying that you are in the set of eligible voters reveals your identity to the arbiter.

### Related Reading

* [Degrees of Freedom by Karl Schroeder](http://hieroglyph.asu.edu/story/degrees-of-freedom/)