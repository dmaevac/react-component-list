dte=$(date +%Y%m%d)
npm run build
git commit -am "update $dte"
git push
npm run publish
