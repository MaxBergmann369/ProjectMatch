#!/bin/bash
# Start Nginx in the background
nginx -g 'daemon off;' &
# Start the Express app
npm start