# Use a lightweight web server as a base image
FROM nginx:alpine

# Copy the built files from the dist directory to the nginx web root
COPY dist/ /usr/share/nginx/html

# Expose the port on which your application will run (default is 80 for nginx)
EXPOSE 80

# The CMD does not need to be specified for the nginx image, as it has a default CMD to start the server
