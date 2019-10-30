set -e

BASEDIR="$( cd "$(dirname "$0")" ; pwd -P )"
(cd $BASEDIR/../ && yarn --force)

GIT_COMMIT="$(git rev-list --all --count)"

node $BASEDIR/change-version.js -f $GIT_COMMIT 