---
layout: layout.njk
title: Software
permalink: "software/index.html"
---

# Software 💾

Here are some of my software projects, all of which are free to use and open-source. They've been featured on [XDA](https://www.xda-developers.com/set-up-adb-and-fastboot-on-linux-mac-os-x-and-chrome-os-with-a-single-command/), [9to5Google](https://9to5google.com/2021/12/02/how-to-downgrade-from-android-12-to-android-11-on-google-pixel/#:~:text=Nexus%20Tools), [Wccftech](https://wccftech.com/set-android-adb-fastboot-mac-os/), [ComputerWorld](https://www.computerworld.com/article/3622366/the-best-progressive-web-apps-for-productivity.html#:~:text=PhotoStack), Google’s [Project Fugu API showcase](https://developer.chrome.com/fugu-showcase/#linkcleaner.app), and other places. 

I have a [Patreon page](https://www.patreon.com/corbindavenport) for supporting my software projects.

Web apps
--------

### [Link Cleaner](https://linkcleaner.app)

Link Cleaner is a web app that removes unnecessary junk from web links in one click, using modern browser APIs for importing and sharing links.

### [PhotoStack](https://photostack.app)

PhotoStack is a batch photo editor with offline support, advanced watermarking, and customizable export options.

### [ImageShare](https://imgshare.corbin.io/)

ImageShare is a web app for sending images and videos to another device, designed for low-end and legacy web browsers. It supports both HTTP and HTTPS, uses QR codes and shortlinks for transfers, and has a static design for fast performance. ImageShare was originally designed as a replacement for the [Nintendo 3DS Image Share Service](https://web.archive.org/web/20170822055326/https://www.nintendo.com/3ds/image-share), and has additional features on Nintendo Wii U and 3DS consoles.

### [Snappy](https://thesnappy.app)

Snappy is a web app for capturing automatic screenshots, inspired by AutoScreenCap. The user can select a window, screen, or browser tab, then start the capture to automatically save an image to local storage on a specified interval. It can even capture background tabs, which are normally not accessible to screenshot tools.

Browser extensions
------------------

### [Share to Mastodon](https://github.com/corbindavenport/share-to-mastodon)

Share to Mastodon is a browser extension for quickly sharing links and tabs to the [Mastodon social network](https://joinmastodon.org/). You can click the Mastodon button in the top bar (or the keyboard shortcut) to share the current tab, or right-click a link on any page.

{% downloadBtn "chrome" "https://chrome.google.com/webstore/detail/bibnjflclpdmbbcncejifemmbggkcjde" %} {% downloadBtn "firefox" "https://addons.mozilla.org/en-US/firefox/addon/share-to-mastodon/" %} {% downloadBtn "edge" "https://microsoftedge.microsoft.com/addons/detail/share-to-mastodon/ppgabkpkgkkcejnnmgckomgfdeanejnc" %}

### [Peek](https://github.com/corbindavenport/peek)

Peek is a browser extension that shows previews for links to files and supported services in web pages. Just hover your mouse over a link, and Peek will display a small popup with an interactive preview of the link's content.

{% downloadBtn "chrome" "https://chrome.google.com/webstore/detail/peek/bfpogemllmpcpclnadighnpeeaegigjk" %} {% downloadBtn "firefox" "https://addons.mozilla.org/en-US/firefox/addon/peek-preview/" %} {% downloadBtn "edge" "https://microsoftedge.microsoft.com/addons/detail/peek/dgpocgoebbbfmliabbfhobcmphodhdaf" %}

### [Picture-in-Picture Shortcut](https://github.com/corbindavenport/pip-shortcut/)

Picture-in-Picture Shortcut adds a keyboard shortcut and toolbar button for switching video players to the Picture-in-Picture mode in the web browser. It also overrides websites that attempt to block PiP mode.

{% downloadBtn "chrome" "https://chromewebstore.google.com/detail/picture-in-picture-shortc/ednlokepbjfieampgfdabeglnceoheni" %} {% downloadBtn "edge" "https://microsoftedge.microsoft.com/addons/detail/pictureinpicture-shortc/mmgmhaokamemfnkmfdhnkkjmpbfmlpck" %}

### [Alt Text Creator](https://github.com/corbindavenport/alt-text-creator)

Alt Text Creator is a browser extension that generates alternate text for images using the GPT-4 with Vision model from OpenAI. It uses an API key supplied by the user, without any extra costs.

{% downloadBtn "chrome" "https://chromewebstore.google.com/detail/alt-text-creator-with-gpt/nlahkceofkdggfgfpheakpaphdfplaio" %} {% downloadBtn "firefox" "https://addons.mozilla.org/en-US/firefox/addon/alt-text-creator/" %}

### [Wikipedia Search](https://github.com/corbindavenport/wikipedia-search)

Wikipedia Search adds the ability to search Wikipedia straight from the address bar. You can also right-click a selected word or phrase to perform a search.

{% downloadBtn "chrome" "https://chrome.google.com/webstore/detail/wikipedia-search/lipakennkogpodadpikgipnogamhklmk" %}

Other projects
-----

### [Nexus Tools](https://github.com/corbindavenport/nexus-tools)

Nexus Tools is an installer for Google's [Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools) package, which includes ADB, Fastboot, and other applications. Nexus Tools is writen in Dart, and can run on Linux, macOS, Windows, Windows Subsystem for Linux, and Chrome OS with a single installation command.

### [Cupertino](https://github.com/corbindavenport/cupertino)

Cupertino is a theme for the Mozilla Firefox browser designed to match the macOS color scheme and design. It provides a slightly more native look and feel for Firefox on Mac computers, inspired by the design of Apple Safari, and it supports both light and dark modes.

{% downloadBtn "firefox" "https://addons.mozilla.org/en-US/firefox/addon/cupertino-theme/" %}
