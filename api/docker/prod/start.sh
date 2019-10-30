/bin/sh -c "
  while ! nc -z $DATABASE_HOST $DATABASE_PORT;
  do
    echo 'Waiting database';
    sleep 1;
  done;
  echo 'Database ready!'!;
"

pm2-docker start ecosystem.json