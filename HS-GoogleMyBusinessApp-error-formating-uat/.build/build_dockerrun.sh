#!/bin/bash

file=".env"
GIT_BRANCH=`git rev-parse --abbrev-ref HEAD`
while IFS="=" read key val
do
  # display $line or do somthing with $line
  if [ -n "$val" ]; then
    eval "$key"=$val
  fi
done < "$file"

cat << EOF
{
  "AWSEBDockerrunVersion": "1",
  "Image": {
    "Name": "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$PROJECT:$ENVIRONMENT",
    "Update": "true"
  },
  "Ports": [
    {
      "ContainerPort": 3000,
      "HostPort": 443
    },
    {
      "ContainerPort": 3000,
      "HostPort": 80
    }
  ],
  "Logging": "/var/log/nodejs/"
}
EOF
