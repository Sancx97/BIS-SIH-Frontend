// API Service Layer for BIS AI Compliance Copilot

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Checks backend health status.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (response.ok) {
      const data = await response.json();
      return { online: true, message: data.message || 'Connected to BIS AI Backend' };
    }
    return { online: false, message: 'Backend returned invalid status' };
  } catch (error) {
    return { online: false, message: 'FastAPI Backend offline (http://127.0.0.1:8000)' };
  }
}

/**
 * Main Ask BIS API call preserving existing FastAPI contract:
 * POST /api/ask { "question": string }
 * Response: { "answer": string, "sources": Array<{ title, url }> }
 */
export async function askBIS(question) {
  if (!question || !question.trim()) {
    throw new Error('Please enter a valid question or product search query.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/ask`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: question.trim() }),
    });

    if (!response.ok) {
      throw new Error(`Server returned error status ${response.status}`);
    }

    const data = await response.json();
    return {
      answer: data.answer || 'No response received from BIS AI engine.',
      sources: data.sources || [
        { title: 'Bureau of Indian Standards Official Portal', url: 'https://www.bis.gov.in' }
      ],
      confidence: 'high',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (error) {
    console.warn('API call to /api/ask failed or backend offline:', error);
    throw error;
  }
}

/**
 * Service placeholders for upcoming features
 */
export async function analyzeCompliance(productDetails) {
  if (!productDetails || !productDetails.trim()) {
    throw new Error('Please enter a product or manufacturing specification.');
  }

  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      product: productDetails.trim(),
    }),
  });

  if (!response.ok) {
    throw new Error(`Server returned error status ${response.status}`);
  }

  return await response.json();
}

export async function analyzeDocument(file) {
  if (!file) {
    throw new Error('Please select a document to analyze.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/analyze-document`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Server returned error status ${response.status}`);
  }

  return await response.json();
}

export async function scanProduct(imageFile) {
  return { status: 'demo', message: 'OCR & Label verification ready.' };
}

export async function searchStandards(query) {
  return { status: 'demo', message: 'Standards search engine ready.' };
}

export async function getAlerts() {
  return { status: 'demo', message: 'Alerts service ready.' };
}
