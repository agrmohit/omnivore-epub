# Omnivore EPUB

A program to generate epub files from your unarchived [Omnivore](https://omnivore.app) articles. Forked from
[here](https://gist.github.com/kebot/90de9c41742cacf371368d85870c4a75)

Steps to use:

- Install [Deno](https://deno.com/manual/getting_started/installation)
- Put your Omnivore key in the `OMNIVORE_API_KEY` variable
- `deno run -A gen-epub.ts`
- the epub file named `output.epub` should be in the directory after execution finishes
