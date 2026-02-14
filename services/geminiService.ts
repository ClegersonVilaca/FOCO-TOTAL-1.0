
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalTip = async (): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Dê uma dica curta e motivacional de 10 palavras sobre foco e estudo em português.",
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    return response.text || "O sucesso é a soma de pequenos esforços repetidos dia após dia.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "O foco é a chave para o domínio de qualquer habilidade.";
  }
};

export const getStudyStrategy = async (subjectName: string, topics: string[]): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `Como estrategista de estudos, crie 3 dicas práticas e específicas para dominar a matéria "${subjectName}". Tópicos atuais: ${topics.join(', ')}. Responda em português com bullet points curtos.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    return response.text || "1. Revise conceitos base. 2. Pratique exercícios diários. 3. Ensine o que aprendeu.";
  } catch (error) {
    console.error("Gemini Strategy Error:", error);
    return "Tente dividir o conteúdo em blocos menores e fazer mapas mentais.";
  }
};

export const getMentorResponse = async (userMessage: string, history: {role: string, text: string}[], subjects: string[]): Promise<string> => {
  try {
    const ai = getAI();
    const systemInstruction = `Você é o Mentor IA do app Foco Total. Seu objetivo é ajudar estudantes a serem mais produtivos, explicar matérias de forma simples e motivá-los. 
    Seja encorajador, mas direto. Use o conhecimento de que o usuário está estudando as seguintes matérias no momento: ${subjects.join(', ')}.`;

    const chatHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    // Add current user message to the history for the model
    chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: chatHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text || "Desculpe, tive um lapso momentâneo. Como posso te ajudar com seus estudos hoje?";
  } catch (error) {
    console.error("Mentor IA Error:", error);
    return "Estou tendo dificuldades em me conectar com minha base de conhecimento acadêmico. Tente novamente em alguns instantes!";
  }
};
