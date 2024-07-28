# X Comment Cleaner
A Chrome extension that removes meaningless or similar comments from the X(Twitter) website.
## Features
- Removes comments that are just emojis
- Removes similar comments using levenshteinDistance algorithm
- Removes comments from the same user that having multiple comments in the same thread
## Installation
1. Download the repository
2. Open Chrome
3. Go to `chrome://extensions/`
4. Enable Developer Mode
5. Click on `Load unpacked`
6. Select the `dist` folder of the repository
## Local Development
1. Clone the repository
2. Run `npm install`
3. Run `npm run watch`
### Deployment
1. Run `npm run build`
### Product
The extension will then be available in the `dist` folder.
