# Carter's Guide — How to Change the Website

Hey Carter. This site is yours to run. You only ever need to edit **one file: `content.js`**.
You don't need to know how to code. Here's everything.

---

## The one rule

Open **`content.js`**. Change the words and numbers between the `"quotation marks"`.
**Don't** delete the quote marks, the commas, or the curly `{ }` and square `[ ]` brackets.
Those are like the walls holding everything up — leave them. Just swap what's inside the quotes.

✅ Good:
```
brandName: "Carter & Harper",   ->   brandName: "Carter and Harper Web Co",
```

❌ Bad (deleted a quote and a comma — this breaks it):
```
brandName: Carter & Harper
```

---

## Common things you'll want to change

**Change a price** — find the package and edit the price:
```
price: "$400",      ->   price: "$450",
```

**Change what a package includes** — edit the lines in `features`:
```
features: [
  "Up to 5 pages",          <- change these words
  "Custom design",
],
```

**Add a brand-new package** — copy a whole block from `{` to `},` and paste it right after, then change the words.

**Change the colors of the whole site** — edit the hex codes in `colors`. Grab new hex codes from a site like coolors.co:
```
accent: "#ff8906",   ->   accent: "#22d3ee",
```

**Change who gets the emails** — that's `contactEmail`. (Ask your dad before changing this.)

---

## How to save your changes so the website updates

After you edit `content.js` and save it, the live site needs to get your new file. Two ways:

**Easiest — GitHub website:**
1. Go to your repo on github.com.
2. Click `content.js`, then the pencil ✏️ (edit) button.
3. Make your changes right there.
4. Scroll down, click the green **Commit changes** button.
5. Wait about 1 minute. The live site updates by itself. Done.

**On your computer (if your dad set up the tools):**
1. Save the file.
2. Open the terminal in this folder and run these three lines:
   ```
   git add .
   git commit -m "Updated the site"
   git push
   ```
3. Wait about a minute. Live site updates by itself.

---

## See your changes before they go live

Double-click `index.html` on your computer to open it in your web browser.
That's the site running on just your machine — mess with `content.js`, refresh the page, and you'll see your changes instantly without anyone else seeing them.

---

## If you break it

Don't panic. You probably deleted a quote, comma, or bracket.
- If you edited on your computer: undo with `Ctrl + Z` until it works again.
- If you edited on GitHub: open the file's **History**, find the last version that worked, and copy it back.
- Or text your dad. Nothing you do here can break anything permanently.

You got this. 🚀
