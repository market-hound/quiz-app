# Build
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /quizapp

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Compile TypeScript code to JavaScript
RUN npm run build

# Production
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /quizapp

# Copy package.json and package-lock.json for production installation
COPY package*.json ./

# Install only production dependencies (no dev dependencies)
RUN npm install --only=production

# Copy the compiled output from the build stage
COPY --from=build /quizapp/dist ./dist

# Expose the application port
EXPOSE 3005

# Command to run the app
CMD ["node", "dist/index.js"]
