set -e

BASEDIR="$( cd "$(dirname "$0")" ; pwd -P )"
VERSION=$(node -p "require('$BASEDIR/../package.json').version") 


node $BASEDIR/change-version.js

rm -f $BASEDIR/../App.apk
(cd $BASEDIR/../android && ./gradlew bundleRelease)
mv $BASEDIR/../android/app/build/outputs/apk/release/app-release.apd $BASEDIR/../App.apd