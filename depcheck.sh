#!/bin/bash

npm-upgrade

mkdir ./compare

github="https://raw.githubusercontent.com"
repo="TryGhost/Casper"
branch="master"

wget -q -P compare -N ${github}/${repo}/${branch}/assets/css/global.css
wget -q -P compare -N ${github}/${repo}/${branch}/assets/css/screen.css

cat ./styles/global.css \
  | sed 's/html\.casper {/html {/g' \
  | sed 's/html\.casper //g' \
  | sed 's/#0078d0/#3eb0ef/g' \
  > compare/global-used.css

cat ./styles/dark-mode.css \
  | sed "s/@import 'global.css';//g" \
  | sed 's/body.dark {/body {/g' \
  | sed 's/body.dark //g' \
  > compare/dark-mode.css

cat ./styles/screen.css compare/dark-mode.css \
  | sed 's/html\.casper {/html {/g' \
  | sed 's/html\.casper //g' \
  | sed 's/color-mod(var(--midgrey) l(-8%));/var(--midgrey);/g' \
  | sed 's/color-mod(var(--midgrey) l(-7%));/color-mod(var(--midgrey) l(+10%));/g' \
  > compare/screen-used.css



cat compare/screen.css \
  | sed '/@media (prefers-color-scheme: dark) {/d' \
  | head -n -1 > compare/screen-original.css
mv compare/screen-original.css  compare/screen.css


diff --ignore-all-space -B -q -s compare/global.css compare/global-used.css
diff --ignore-all-space -B -q -s compare/screen.css compare/screen-used.css

rm -rf compare out
