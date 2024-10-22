#### API endpoints

#### Create a new quiz ########
POST /api/quiz/create         
Request body
{
  "title": "General Knowledge",
  "questions": [
    {
      "text": "What is the capital of France?",
      "options": ["Paris", "London", "Berlin", "Madrid"],
      "correct_option": 0
    },
    {
      "text": "Who wrote '1984'?",
      "options": ["George Orwell", "Aldous Huxley", "Mark Twain", "Ernest Hemingway"],
      "correct_option": 0
    }
  ]
}
Response body 
(201){
    "id": "6824206b-0760-4030-9798-327d96636cc9",
    "title": "General Knowledge Quiz",
    "questions": [
        {
            "id": "77dfc820-54a2-401a-b21e-b1f3552d8885",
            "text": "What is the capital of France?",
            "options": [
                "Berlin",
                "Madrid",
                "Paris",
                "Lisbon"
            ],
            "correct_option": 2
        },
        {
            "id": "5f2d05b3-0998-464f-806a-79e3bbd1c106",
            "text": "Who wrote 'Hamlet'?",
            "options": [
                "Charles Dickens",
                "Mark Twain",
                "William Shakespeare",
                "Ernest Hemingway"
            ],
            "correct_option": 2
        }
    ]
}

GET /api/quiz/:quiz_id             Fetch a quiz by ID (questions without correct answers).
id from the response of post quiz API

POST /api/quiz/:quiz_id/submit         Submit an answer.
Request body
{
    "question_id": "c582459e-4ecf-4191-b96e-f46c3183fc83",
    "selected_option": 2,
    "user_id": "user"
}

Response body
(200){
    "is_correct": true
}
or
(200){
    "is_correct": false,
    "correct_option": 2
}
or 
(400){
    "message": "Answer already submitted for this question",
    "existingAnswer": {
        "question_id": "1830d069-9bfa-476d-84b2-5e3cc84977e7",
        "selected_option": 2,
        "is_correct": true
    }
}


GET /api/quiz/:quiz_id/results/:user_id: Get a user's results for a quiz.
Response body
(200){
    "quiz_id": "ac4be9b3-7746-47a3-b0ab-f36df1c39d36",
    "user_id": "user",
    "score": 1,
    "answers": [
        {
            "question_id": "1830d069-9bfa-476d-84b2-5e3cc84977e7",
            "selected_option": 2,
            "is_correct": true
        },
        {
            "question_id": "3227b63d-2f34-4615-8af3-6e0d45ba7f7f",
            "selected_option": 3,
            "is_correct": false
        }
    ]
}


###### Docker #######
Create docker image 
docker build -t quiz-app .
Running the app
docker run -p 3005:3005 quiz-app

No need of docker-compose.yml file as it is just a single service but added it if required in the future.  