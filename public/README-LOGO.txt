USING THE ORIGINAL FSOCIETY ARTWORK
===================================

The site ships with a CSS recreation of the gothic FSOCIETY wordmark, so it
renders perfectly with no extra files.

To use your original logo image instead:

1. Save your logo file in this folder as:
       public/fsociety-logo.png
   (a PNG with a TRANSPARENT background looks best on the dark theme)

2. Open  components/Logo.tsx  and change:
       const USE_IMAGE = false;
   to:
       const USE_IMAGE = true;

The hero <BrandLockup> will then render your image automatically.
The small navbar/footer wordmark stays as crisp CSS text (scales cleanly).
