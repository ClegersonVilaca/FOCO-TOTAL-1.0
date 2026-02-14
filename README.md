<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Foco Total 1.0

## Como Deployar no Vercel

1.  **Conecte seu Repositório**: No Dashboard do Vercel, importe seu projeto do GitHub/GitLab/Bitbucket.
2.  **Configurações de Build**:
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
    - **Install Command**: `npm install`
3.  **Variáveis de Ambiente**: No painel do Vercel, adicione:
    - `GEMINI_API_KEY`: Sua chave da API do Gemini.
    - `VITE_SUPABASE_URL`: URL do seu projeto Supabase.
    - `VITE_SUPABASE_ANON_KEY`: Sua chave anônima do Supabase.
4.  **Deploy**: Clique em Deploy.

## Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Jj28KqPpRfK5RXBNAYplVWrGiHJvjprB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
