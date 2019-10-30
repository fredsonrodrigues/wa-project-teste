set -e

BASEDIR="$( cd "$(dirname "$0")" ; pwd -P )"
VERSION=$(node -p "require('$BASEDIR/../package.json').version") 

node $BASEDIR/change-version.js

if ! hash fastlane 2>/dev/null; then
	echo "\x1B[91m"
  echo 'É NECESSÁRIO INSTALAR O fastlane'
  echo 'https://docs.fastlane.tools/getting-started/ios/setup/'
fi

(cd ios && fastlane release)

sh $BASEDIR/upload-sourcemap.ios.sh