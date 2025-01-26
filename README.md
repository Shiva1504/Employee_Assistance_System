# Employee Assistance System


# Setup Instructions

### Step 1: Clone the Repository
Clone the repository to your local machine by running the following command:
 <pre><code> git clone https://github.com/Shiva1504/Employee_Assistance_System</code></pre>
### Step 2: Create a .env File
In the root directory of the project, create a .env file and add the following API keys for their respective services:
 <pre><code>
VITE_OPENAI_API_KEY=your_openai_api_key_here <br>
VITE_CLAUDE_API_KEY=your_claude_api_key_here <br>
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here<br>
VITE_COHERE_API_KEY=your_cohere_api_key_here<br>
VITE_GEMINI_API_KEY=your_gemini_api_key_here<br></code></pre>
Make sure to replace your_<service>_api_key_here with the actual API keys.<br> 

### Step 3: Install Dependencies
Run the following command to install all required dependencies:

<pre><code>npm install </pre></code> 


### Step 4: Run the Development Server
Start the development server by running:

<pre> <code> npm run dev </code></pre>
Your Employee Assistance System should now be running locally.
