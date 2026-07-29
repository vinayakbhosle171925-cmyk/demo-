// Netlify Function: proxy.js
// Purpose: Proxy requests from the frontend to a third-party API using a secret API key stored in Netlify environment variables.
// How to use:
// 1) In Netlify site settings set two environment variables:
//    - API_KEY : your secret API key
//    - NETLIFY_API_BASE_URL : the base URL of the API you want to call (e.g. https://api.example.com/search)
// 2) Call from the frontend like: fetch('/.netlify/functions/proxy?q=data+scientist')
//    The function will call `${NETLIFY_API_BASE_URL}?q=<q>` with Authorization: Bearer <API_KEY> header.
// 3) Adjust headers or query parameters below as required by the target API.

const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // Allow simple CORS for demo usage. For production tighten this to your domain.
  const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  try {
    const apiKey = process.env.API_KEY; // set this in Netlify site settings -> Environment
    const baseUrl = process.env.NETLIFY_API_BASE_URL; // set this to the API's base URL

    if (!apiKey || !baseUrl) {
      return {
        statusCode: 500,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'API_KEY or NETLIFY_API_BASE_URL is not configured in environment variables.' })
      };
    }

    const q = event.queryStringParameters && event.queryStringParameters.q ? event.queryStringParameters.q : '';
    // Build the target URL. Modify if the third-party API expects different params.
    const url = `${baseUrl}?q=${encodeURIComponent(q)}`;

    // Example using Bearer token. Change to ?key= or custom header if needed by your API.
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const data = await resp.text();

    return {
      statusCode: resp.status || 200,
      headers: Object.assign({ 'Content-Type': 'application/json' }, CORS_HEADERS),
      body: data
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: err.message })
    };
  }
};
