FROM image-mirror-prod-registry.cloud.duke.edu/library/node:latest

RUN mkdir /srv/app
WORKDIR /srv/app
ADD package.json .
ADD package-lock.json .
RUN npm install
RUN npm install -g serve
ADD . .

# RUN env | grep HOST

#for productiion
# RUN npm run build
EXPOSE 8080
CMD ["serve", "-s", "build", "-l", "8080"]
