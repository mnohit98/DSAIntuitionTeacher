#!/bin/bash

# Font download script for DSA Intuition Teacher
# This script downloads the required fonts for the handwritten notes theme

echo "🎨 Downloading fonts for handwritten notes theme..."

# Create fonts directory if it doesn't exist
mkdir -p assets/fonts

# Download Virgil font (or similar handwritten font)
echo "📝 Downloading Virgil font..."
curl -L "https://fonts.gstatic.com/s/indieflower/v17/m8JVjfNVeKWVnh3QMuKkFcZVaUuC.ttf" -o "assets/fonts/IndieFlower-Regular.ttf"

# Download Indie Flower as fallback
echo "🌸 Downloading Indie Flower font..."
curl -L "https://fonts.gstatic.com/s/indieflower/v17/m8JVjfNVeKWVnh3QMuKkFcZVaUuC.ttf" -o "assets/fonts/IndieFlower-Regular.ttf"

# Download Architects Daughter as another fallback
echo "🏗️ Downloading Architects Daughter font..."
curl -L "https://fonts.gstatic.com/s/architectsdaughter/v11/KtkxAKiDZI_td1Lkx62xHZHDtgO_Y-bvY0lqoqnbq9snsTsg.ttf" -o "assets/fonts/ArchitectsDaughter-Regular.ttf"

echo "✅ Fonts downloaded successfully!"
echo "📁 Fonts are now available in assets/fonts/"
echo "🚀 You can now run the app with the handwritten notes theme!"
