FROM node:5

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install --production

# Bundle app source
COPY src /app/src/
RUN mkdir -p /app/lib

# build ES5 compatible files
RUN npm run-script build
RUN ls -l /app/lib

EXPOSE 9090
CMD ["npm", "run-script", "start"]