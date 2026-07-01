const User = require('../models/User');

const SYSTEM_PROMPT = `You are MediCare AI Assistant, a helpful medical assistant designed to:
1. Help patients describe their symptoms clearly
2. Suggest appropriate medical specialists
3. Generate a pre-consult summary for doctors
4. Never provide a medical diagnosis or prescribe medication
5. Always advise consulting a real doctor for proper medical advice

Respond in a friendly, empathetic, and professional tone. For each patient query:
- Ask follow-up questions if needed to understand symptoms better
- Suggest 1-2 relevant medical specialists
- Keep responses concise and easy to understand

When you have enough information, provide:
1. Summary of symptoms
2. Recommended specialist
3. Pre-consult summary`;

const userConversations = {};

/**
 * @desc    Process AI health assistant message with Gemini API (Raw Fetch Version)
 * @route   POST /api/ai/chat
 * @access  Private
 */
const processAIMessage = async (req, res) => {
  console.log(req.body);
  try {
    const { message, conversationHistory = [] } = req.body;
    const userId = req.user?._id?.toString() || 'guest';

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      console.error('GEMINI_API_KEY is missing from environment');
      return res.status(500).json({ success: false, message: "API configuration error" });
    }

    // Initialize conversation history for user
    if (!userConversations[userId]) {
      userConversations[userId] = { history: [], symptoms: [] };
    }
    const conversation = userConversations[userId];

    // Build History Text & Prompt like AnswerFromAPI
    const historyText = conversation.history
      .map((msg, index) => `#${index + 1} ${msg.role === 'user' ? 'Patient' : 'Assistant'}: ${msg.text}`)
      .join("\n\n");

    const prompt = `${SYSTEM_PROMPT}\n\nConversation history:\n${historyText}\n\nPatient: ${message}\n\nPlease respond strictly in JSON format with:\n{
      "text": "your response to the patient",
      "chips": ["suggested quick responses"],
      "specialist": "suggested specialist type",
      "summary": {
        "chiefComplaint": "brief description of symptoms",
        "duration": "not specified yet",
        "severity": "Low/Medium/High",
        "other": "additional relevant info"
      }
    }`;

    // Raw Fetch Call with AbortController Timeout (30 seconds)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let aiText = '';
    let suggestedSpecialist = 'General Practitioner';
    let chips = ['Chest pain', 'Headache', 'Skin rash', 'Fever'];

    console.log('Calling Gemini API via Fetch...');
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      if (response.status === 429) throw new Error('API quota exceeded');
      if (response.status === 401) throw new Error('Invalid API key');
      throw new Error(`Gemini API error ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse JSON Response from Gemini
    if (responseText) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        aiText = parsed.text || responseText;
        chips = parsed.chips || chips;
        suggestedSpecialist = parsed.specialist || 'General Practitioner';
      } else {
        aiText = responseText;
      }

      // Sync custom local history tracking
      conversation.history.push({ role: 'user', text: message });
      conversation.history.push({ role: 'model', text: aiText });
    }

    // Fallback if anything fails or text is empty
    if (!aiText) {
      const fallbackResponses = [
        { text: "I'm sorry to hear that. Could you tell me more about when these symptoms started?", chips: ["Today", "2-3 days ago", "More than a week"], specialist: "General Practitioner" },
        { text: "Thank you. Are you experiencing any other symptoms like fever or dizziness?", chips: ["Yes, fever", "Dizziness", "No other symptoms"], specialist: "General Practitioner" }
      ];
      const fallback = fallbackResponses[conversation.history.length % fallbackResponses.length];
      aiText = fallback.text;
      chips = fallback.chips;
      suggestedSpecialist = fallback.specialist;
    }

    // Add symptoms logic tracker
    if (conversation.history.length <= 2) {
      conversation.symptoms.push(message);
    }

    // Fetch Recommended Doctors from DB
    const doctors = await User.find({
      role: 'doctor',
      $or: [
        { specialization: new RegExp(suggestedSpecialist, 'i') },
        { specialization: { $exists: true } }
      ]
    }).select('name email specialization').limit(3);

    // Pre-consult summary structured object
    const summary = {
      patient: req.user?.name || 'Patient',
      chiefComplaint: conversation.symptoms[0] || 'Not provided',
      duration: 'Not specified yet',
      severity: 'Medium',
      other: conversation.symptoms.slice(1).join(', ') || 'No additional details',
      suggested: suggestedSpecialist,
    };

    return res.status(200).json({
      success: true,
      data: {
        response: aiText,
        chips: chips,
        summary: summary,
        recommendedDoctors: doctors,
      },
    });

  } catch (error) {
    console.error('AI Processing Error:', error.message);

    let errorMessage = 'Server error processing your message';
    let errorCode = 'UNKNOWN_ERROR';

    if (error.message?.includes('quota')) {
      errorMessage = '❌ API Quota Exceeded: Please upgrade your plan or wait for the reset.';
      errorCode = 'QUOTA_EXCEEDED';
    } else if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      errorMessage = '⏱️ Request Timeout: The API took too long to respond.';
      errorCode = 'TIMEOUT';
    } else if (error.message?.includes('API key')) {
      errorMessage = '🔑 Invalid API Key: Check your configuration environment.';
      errorCode = 'INVALID_KEY';
    }

    return res.status(500).json({ success: false, message: errorMessage, errorCode });
  }
};

/**
 * @desc    Reset AI conversation
 * @route   POST /api/ai/reset
 * @access  Private
 */
const resetAIConversation = async (req, res) => {
  try {
    const userId = req.user?._id?.toString() || 'guest';
    if (userConversations[userId]) {
      delete userConversations[userId];
    }
    return res.status(200).json({ success: true, message: 'Conversation reset successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error resetting conversation' });
  }
};

module.exports = { processAIMessage, resetAIConversation };
