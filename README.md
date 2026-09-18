Clone the Repository:

git clone https://github.com/your-username/govtracker-ai.git
cd govtracker-ai


Setup Backend:

cd server
npm install
# Create a .env file with PORT=5000 and MONGO_URI=<your_mongodb_connection_string>
node server.js


Setup Frontend:

cd ../client
npm install
npm run dev