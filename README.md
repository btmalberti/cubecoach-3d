# CubeCoach 3D

A free, browser-based 3×3 Rubik’s Cube helper.

## Run locally
Open `index.html` in a modern browser with an internet connection. The page loads its 3D and cube-solving libraries from public CDNs.

## Publish free with GitHub Pages
1. Create a **public** GitHub repository.
2. Upload `index.html` and `.nojekyll` to the repository root.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. After GitHub Pages finishes deploying, the public site URL will appear in that Pages settings panel.

## Using the colour editor
The cube begins with the six standard colours in the solved arrangement (white top, green front, red right). Rotate the 3D cube to inspect faces. Choose a colour and click only the stickers whose colours differ on the real scrambled cube. If no stickers are changed, the app tells the user that the displayed cube is still solved and asks them to enter the scramble.

The solver validates the colour counts and cube legality, calculates a fast two-phase solution, and checks the simulated result before animating the same 3D cube.
