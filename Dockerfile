FROM node:16.16.0
WORKDIR /usr/app
COPY ./package*.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "start"]
EXPOSE 8000
