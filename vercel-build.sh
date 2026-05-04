#!/bin/bash
set -e

echo "Building frontend..."
npm run build:web

echo "Building backend..."
npm --prefix backend run build

echo "Build complete!"
