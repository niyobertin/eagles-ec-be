FROM node:16 As builder

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install 


FROM node:16-alpine

WORKDIR /app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY . .

# EXPOSING PORTS FOR APPLICATION AND Database
EXPOSE 3000

CMD npm run dev