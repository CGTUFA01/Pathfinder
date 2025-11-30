# Google Custom Search API Setup Guide

This script uses Google's Custom Search JSON API to fetch images for attractions.

## Setup Steps

### 1. Get Google API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Custom Search API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Custom Search API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Create Custom Search Engine

1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" to create a new search engine
3. Configure:
   - **Sites to search**: Enter `*` (asterisk) to search the entire web
   - **Name**: Give it a name (e.g., "Attraction Images")
4. Click "Create"
5. Copy your **Search Engine ID** (CX) from the control panel

### 3. Configure Environment Variables

Create a `.env` file in the `explore-usa` directory:

```env
GOOGLE_API_KEY=your_api_key_here
GOOGLE_CX=your_search_engine_id_here
```

**Important**: Add `.env` to your `.gitignore` file to keep your API keys secure!

## Usage

Once configured, run:

```bash
npm run fetch-images
```

or

```bash
node scripts/fetchImages.js
```

## Pricing & Limits

- **Free Tier**: 100 queries per day
- **Paid**: $5 per 1,000 queries (after free tier)
- **Daily Limit**: 10,000 queries per day

The script will warn you when you exceed the free quota.

## Troubleshooting

- **"Missing required environment variables"**: Make sure your `.env` file exists and has both `GOOGLE_API_KEY` and `GOOGLE_CX`
- **API errors**: Check that the Custom Search API is enabled in your Google Cloud project
- **No results**: Try adjusting the search terms or check your Search Engine configuration


