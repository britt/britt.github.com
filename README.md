# Hi. Welcome to brittcrawford.com.

This is my personal website. Right now it just has a business card-like list of links and a non-committal description. I might add more to it in the future.

## How weekly reading works

1. Instapaper -> IFTTT -> Google Sheets
2. Edit with AppSheet.com app
3. Load into site via script

## How to deploy

      bin/publish

### Todo

- convert fetch weekly reading to use https://www.npmjs.com/package/google-spreadsheet-to-json instead of sheetsu

```
/Users/bcrawford/workspace/brittcrawford.com/bin/fetch_weekly_reading:64
        if(err && /EEXIST/.match(err.toString()) === null) {
                           ^

TypeError: /EEXIST/.match is not a function
    at FS.mkdir (/Users/bcrawford/workspace/brittcrawford.com/bin/fetch_weekly_reading:64:28)
    at FSReqWrap.oncomplete (fs.js:117:15)
```



