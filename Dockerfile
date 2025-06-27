# Stage 1: Build the Next.js application
# Use a lightweight Node.js image as the base for the build stage.
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /build

# Copy package.json and package-lock.json to install dependencies.
# This optimizes Docker's cache: if these files don't change,
# the 'npm ci' layer won't be rebuilt.
COPY package.json package-lock.json ./

# Install dependencies using npm ci for clean and reproducible builds.
# 'npm ci' is preferred over 'npm install' in CI/CD and production builds
# as it strictly uses package-lock.json.
RUN npm ci

# Copy the rest of the application code to the working directory.
COPY . .

# Build the Next.js application for production.
# This command generates the optimized build output in the `.next` directory.
# This step is crucial even for 'npm run dev' if you want to pre-cache builds.
# However, if ONLY 'npm run dev' is intended, this step might be skipped
# or adjusted to 'npm run dev' directly, but a production build is generally
# recommended for the 'start' command in the final image.
RUN npm run build

# Stage 2: Create a smaller, production-ready image
# Use a minimal Node.js image for the final runtime.
# This image contains the Node.js runtime necessary to run 'npm start'.
FROM node:20-alpine AS runner

# Set the working directory inside the container.
WORKDIR /build

# Disable telemetry data collection for Next.js in production builds.
ENV NEXT_TELEMETRY_DISABLED 1

# Copy necessary files from the builder stage for the Next.js runtime:
# 1. public folder: Contains static assets like images, fonts.
COPY --from=builder /build/public ./public
# 2. .next folder: Contains the built Next.js application output.
COPY --from=builder /build/.next ./.next
# 3. node_modules: Required production dependencies for the Next.js server.
#    This includes dependencies needed by Next.js itself and any server-side logic.
COPY --from=builder /build/node_modules ./node_modules
# 4. package.json: Needed for the 'start' script to run.
COPY --from=builder /build/package.json ./package.json

# If you have custom server.js or other server-side files, copy them here.
# For example, if you're using a custom server with Express:
# COPY --from=builder /app/server.js ./server.js

# Expose the port on which the Next.js application will run.
# The default port for Next.js is 3000.
EXPOSE 3000

# Define the command to start the Next.js application in production mode.
# This will run the `next start` command via `npm start`.
CMD ["npm", "start"]

# --- Alternative for Development (npm run dev) ---
# If you primarily want to run 'npm run dev' inside the container for local development,
# you would typically use a simpler, single-stage Dockerfile and potentially volume mounts.
#
# FROM node:20-alpine
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm ci
# COPY . .
# EXPOSE 3000
# CMD ["npm", "run", "dev"]
#
# Note: For 'npm run dev', you'd usually also add a volume mount to sync code changes
# from your host machine into the container without rebuilding the image every time.
# Example docker-compose.yml for dev:
# services:
#   nextjs-dev:
#     build: .
#     ports:
#       - "3000:3000"
#     volumes:
#       - .:/app
#       - /app/node_modules # Avoid host node_modules overwriting container's
#     command: npm run dev
