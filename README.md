# Hi. Welcome to brittcrawford.com.

This is my personal website. Right now it just has a business card-like list of links and a non-committal description. I might add more to it in the future.

## How weekly reading works

1. IFTTT -> Google Sheets
2. Edit with AppSheet.com app
3. Load into site via script

## How to deploy

      gh-pages --dist public --branch master --dotfiles

### Todo

- [] Blog
- [] publishing on a schedule
- [] Update to use new Sheetsu API
- [] Configure LINTer for ES6
- [] Drafts
- [] fetch_weekly_reading can handle empty folders
- [] Publish static pages rather than single page app

#### Done
- [x] Change icon color
- [x] Fix layout on phone
- [x] Weekly reading notes
  + [x] binary to fetch weekly reading notes as JSON
  + [x] editor interface to update notes
  + [x] re-order columns
- [x] Deployment script
  + [x] Build script
  + [x] GitHub pages deployment
- [x] Fix site title for weekly reading pages
- [x] Hide last name in header on mobile
- [x] RSS feed
  + [x] Add all posts to feed (remove dep on path)
  + [x] Date all posts
- [x] Add Gutenberg shout out https://matejlatin.github.io/Gutenberg/
- [x] Show assets in dev view
- [x] Better page titles
- [x] Extract Headline component
- [x] Upgrade to gatsby 0.10.0



