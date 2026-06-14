VOUCH IMAGES
============

Drop your vouch / proof screenshots in THIS folder, e.g.:
    public/vouches/1.png
    public/vouches/2.jpg

Then list the filenames in lib/data.ts -> vouchImages, e.g.:
    export const vouchImages = ["1.png", "2.jpg", "3.png"];

The carousel on the site will show them automatically (swipe / arrows /
dots, click to open full size). If the list is empty, the carousel is
hidden and nothing breaks.
