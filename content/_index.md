---
title: brittcrawford.com
path: /
---

These are things that I have built simply because I wanted them to exist, or in the case of **avro-sqlite**, because I wanted to see if I could.[^2] I like tools that serve me, not ones that try to extract value from me or my attention. I also like the [process of building and understanding](https://brucesterling.tumblr.com/post/749569601319452672/realistic-utopias-a-speech-by-bruce-sterling) the things that I use.

## Home Cooked Software [^1]

* [Readinglist.live](https://www.readinglist.live) - Turn any web page into a podcast episode, with decently human sounding voices. _(It just reads it to you in a nice human voice, no AI commentary or nonsense like that.)_
* [lotsofcsvs.com](https://www.lotsofcsvs.com) - a **small data** warehouse built with CSV and HTTP as its API. It is intentionally as barebones as possible. It aims to be a simple API for recording and fetching data that works with everything.
* [Teleprompter](https://github.com/britt/teleprompter)  - A system to manage and update prompts for LLMs at runtime on Cloudflare Workers.
* [avro-sqlite](https://github.com/britt/avro-sqlite) - a Go package to read a SQLite database, extract the schema and data to [Apache Avro](https://avro.apache.org/) and vice versa
* [yts](https://github.com/britt/vibes/tree/main/yts) - A bash function to download YouTube video transcripts and convert them to Markdown format.
Following the example of [David Gasquez's](https://davidgasquez.com/useful-llm-tools-2024/) excellent [qv](https://github.com/davidgasquez/dotfiles/blob/bb9df4a369dbaef95ca0c35642de491c7dd41269/shell/zshrc#L75-L99) function.


## iOS Shortcuts

* [Remember This](https://www.icloud.com/shortcuts/1f2b289be44b425ba16934af629b688f) - **I didn't create this one** but I have found it very useful, and I did fix a bug where sometimes it would not create the day's note.

>This shortcut helps someone with short term memory loss log what happens throughout the day. It helps them keep track of what they have done, who they have met, etc. It will ask you what you want to remember. If run for the first time for the day, it will create a new note and log the input, with the time. It it’s been run already, it will grab the note and append the the note with the time and new content.

* [Remember](https://www.icloud.com/shortcuts/18f7fe2b50084cd9ba98655c8d4b9a90) - A version of the shortcut above 👆, but one that can be used from the share sheet for URLs, text, phots, and files.
* [Log Food](https://www.icloud.com/shortcuts/ce0b8eb392184f44a510c96f0f1d9509) - Logs whatever you ate to a note named "Food Eaten on {date}" tagged with #food #tracking. You can also add a picture if you want.
* [Log Weight](https://www.icloud.com/shortcuts/52abec89fceb40369d192f7e6b270273) - Shout at your phone while you're on the scale and log your weight in Apple Health.
* [Read Aloud](https://www.icloud.com/shortcuts/4e68f1c746334726a8106459f8f3c51b) - Let's you tap "share" on just about anything (text, web pages, whatever) and have it read aloud to you.
* [Done List](https://www.icloud.com/shortcuts/184e00cafc484dabbbe89efe19c44cba) and [Yesterday's Done List](https://www.icloud.com/shortcuts/00c6d7ac0b58419dbf30831de73e26f1) - Keep and show yourself your [Done List](https://www.oliverburkeman.com/donelist)
> Each entry is a cheering reminder that you could, after all, have spent the day doing nothing constructive – yet look what you did instead!
>
> -- [Oliver Burkeman on the Done List](https://www.oliverburkeman.com/donelist)
* [lotsofcsvs template](https://www.icloud.com/shortcuts/b402f6377b5b42169298285437fb28db) - a template to log stuff from your phone to [lotsofcsvs.com](https://www.lotsofcsvs.com).

## Other Stuff
* [Cocktail Recipes](/cocktails/) - A small collection of cocktails that I've created.
* [We Can Be Heroes](/we_can_be_heroes.pdf) - ***This isn't rock n. roll. It's suicide!*** A one-page role playing game where every player is David Bowie.

## Abandoned but not forgotten
* [Havamal](https://smile.amazon.com/Snugglebear-Team-Company-Havamal/dp/B07N114BWY/ref=sr_1_2?keywords=havamal&qid=1550960415&s=digital-skills&sr=1-2-catcorr) - The wisdom of Odin, told by Alexa. Say, "Alexa tell me the wisdom of Odin."
* [Testivus](https://github.com/britt/testivus/) - _(inactive)_ A Go test helper library to let your code know how it disappoints you.


[^1]: _[Maggie Appleton - Home-Cooked Software and Barefoot Developers](https://maggieappleton.com/home-cooked-software)_
[^2]: The entire package including documentation was written by an LLM.