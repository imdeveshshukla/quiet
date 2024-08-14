# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

# Copy the rest of your application code
COPY . .

# Generate Prisma client
RUN npx prisma generate


EXPOSE 3000

CMD ["npm", "run", "dev"]
