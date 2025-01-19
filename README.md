Bank Chatbot UI
A simple React + Vite (TypeScript) chatbot user interface that connects to a FastAPI backend. This chatbot demonstrates:

Retaining chat history in the browser (using localStorage).
Relative timestamps for messages (e.g. “3 minutes ago”, “yesterday”) using dayjs.
A typing indicator for the bot.
A minimal “WhatsApp-like” chat layout.
Table of Contents
Prerequisites
Project Structure
Installation & Local Development
Configuration
Build for Production
Deployment to Azure Static Web Apps
Contributing
License
Prerequisites
Node.js (v14 or above recommended).
npm or Yarn.
A FastAPI instance running (publicly accessible) on Azure or elsewhere.
(Optional) Azure CLI if you want to deploy from the command line.
Project Structure
``bash

├── public/               # Static assets (favicon, etc.)
├── src/
│   ├── App.tsx           # Main React App component
│   ├── main.tsx          # Entry point for Vite/React
│   ├── types.ts          # Type definitions (ChatMessage, etc.)
│   ├── utils/
│   │   └── dayjs.ts      # dayjs config for relative time
│   └── index.css         # Global CSS (optional)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md             # This file
Installation & Local Development
Clone the repository:

``bash

git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
Install dependencies:

``bash

npm install
# or
yarn install
Start the development server:

``bash

npm run dev
# or
yarn dev
Open your browser to the address shown (usually http://localhost:5173).

Configuration
In src/App.tsx, you’ll find a line like:

``ts

const API_URL = 'http://bank-chatbot-0125.eastus.azurecontainer.io:8000/api/chat';
Change this to your own FastAPI endpoint if needed.
If your FastAPI service enforces HTTPS, make sure the URL starts with https://....
Note: If you encounter CORS errors, ensure your FastAPI application allows requests from your React app’s domain or local dev port. For example, in FastAPI:

``python

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or your specific domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Build for Production
To create an optimized production build:

``bash

npm run build
# or
yarn build
This generates a dist folder with static files (HTML, JS, CSS) that can be deployed to any static hosting service.

Deployment to Azure Static Web Apps
The easiest way to host this front-end on Azure is Azure Static Web Apps, especially if you already have your FastAPI app hosted on a separate service/container. Here’s the workflow:

Push Your Code to GitHub
Make sure your local code is committed and pushed to a GitHub repository.

Create a Static Web App in Azure

Go to the Azure Portal.
Search for “Static Web Apps” → Create.
Choose GitHub as the source, select your repo and branch.
App location: / (or the subfolder containing your package.json).
Output location: dist (the default build folder for Vite).
Leave API location blank (we’re using an external FastAPI backend).
Wait for the GitHub Action to Complete

Azure will create a GitHub Actions workflow in your repo.
The workflow will build and deploy your Vite React app to a URL like https://<app-name>.azurestaticapps.net.
Verify and Test

Go to the provided URL.
Ensure it can successfully call your FastAPI endpoint at http://bank-chatbot-0125.eastus.azurecontainer.io:8000/api/chat.
If needed, fix any CORS issues.
Once set up, any push to your GitHub repo’s configured branch automatically redeploys your site.

Contributing
Fork this repository.
Create a new branch: git checkout -b feature/xyz.
Make your changes and commit them: git commit -m 'Add xyz feature'.
Push to the branch: git push origin feature/xyz.
Create a pull request on GitHub.
We welcome contributions that improve the UI, add new features, or optimize the chatbot experience!

License
This project is licensed under the MIT License – feel free to use and modify it for your own purposes. See the LICENSE file for details.

Happy chatting! If you have any questions, feel free to open an issue or create a discussion in the repository.






