# Trimcraft site assets

Static files used by the Trimcraft website, served through jsDelivr and pinned to a commit.

- `stills/`: still images of the home page scene, used by the native home on phones and tablets.
- `home3d/`: the desktop 3D home story. A small loader on the Webflow home page starts `home3d/boot.js` after the page has loaded, on screens 1200px and wider with enough power, and never when reduced motion is on.

`home3d/` is generated from the original home page by `tools/home3d/build_home3d.py` in the trimcraft-website branch. Edit the source there and rebuild instead of editing these files by hand.
