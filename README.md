# StackOverflowApi

## Links:

- [Discord Bot](https://hedystia.com/invite) You need `Administrator` permission to enter the dashboard
- [Discord](https://hedystia.com/support)
- [Website](https://hedystia.com/)

## app

Creates an instance of the Express application.

### Returns

- {Object} - The Express application object.

## getQuestions(tag, page_number)

Retrieves a list of questions from a website based on the specified tag and page number.

### Parameters

- {string} tag - The tag to filter the questions by.
- {number} page_number - The page number of the questions to retrieve.

### Returns

- {Promise<Array<{id: string}>>} - A promise that resolves to an array of question objects, each containing an ID.

## getQuestionAndAnswerById(questionId)

Retrieves a question and its corresponding answer from a website based on the provided question ID.

### Parameters

- {number} questionId - The ID of the question to retrieve.

### Returns

- {Promise<{question: {title: string, body: string}, answer: {body: string}}>} - A promise that resolves to an object containing the question and answer.

## app.get("/")

Handles GET requests to the root endpoint ("/").

### Parameters

- {Object} req - The request object.
- {Object} res - The response object.

## app.get("/api")

Handles a GET request to the "/api" endpoint. Retrieves questions based on the provided query parameters and returns a JSON response.

### Parameters

- {Object} req - The request object.
- {Object} res - The response object.

## app.listen(port)

Starts the application server and listens for incoming requests on the specified port.

### Parameters

- {number} port - The port number to listen on.
