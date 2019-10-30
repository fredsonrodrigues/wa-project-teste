set -e
npx jetify

bold=$(tput bold)
normal=$(tput sgr0)
yellow=$(tput setaf 3)

if hash pod 2>/dev/null; then
  (cd ios && pod install)
else
  echo "${yellow}\n**************************************************"
  echo "If you are on a ${bold}MAC${normal}${yellow} you need to install cocoapods: "
  echo "RUN: ${bold}sudo gem install cocoapods${normal}${yellow}"
  echo "**************************************************${normal}"
fi