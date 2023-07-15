import cheerio from "cheerio";
import express from "express";

/**
 * Creates an instance of the Express application.
 * @returns {Object} - The Express application object.
 */
const app = express();

/**
 * Retrieves a list of questions from a website based on the specified tag and page number.
 * @param {string} tag - The tag to filter the questions by.
 * @param {number} page_number - The page number of the questions to retrieve.
 * @returns {Promise<Array<{id: string}>>} - A promise that resolves to an array of question objects, each containing an ID.
 */
async function getQuestions(tag, page_number) {
  /**
   * Constructs a URL based on the given tag.
   * @param {string | null} tag - The tag to construct the URL with.
   * @returns {string} The constructed URL.
   */
  let url = "";
  if (tag == null) {
    url = `https://stackoverflow.com/questions?tab=active&page=${page_number}`;
  } else {
    url = `https://stackoverflow.com/questions/tagged/${tag}?tab=active&page=${page_number}`;
  }

  /**
   * Fetches the resource at the specified URL using the HTTP GET method.
   * @param {string} url - The URL of the resource to fetch.
   * @returns {Promise<Response>} - A promise that resolves to the response object representing the fetched resource.
   */
  const response = await fetch(url);
  /**
   * Retrieves the HTML content from the response object.
   * @param {Response} response - The response object from a fetch request.
   * @returns {Promise<string>} - A promise that resolves to the HTML content as a string.
   */
  const html = await response.text();

  /**
   * Load the given HTML string into a Cheerio object.
   * @param {string} html - The HTML string to load.
   * @returns A Cheerio object representing the parsed HTML.
   */
  const $ = cheerio.load(html);
  /**
   * Retrieves all div elements with an id starting with "question-summary-" using a jQuery selector.
   * Maps each element to an object with the id attribute as the value.
   * Returns an array of these objects.
   * @returns {Array} An array of objects containing the id attribute of each matched div element.
   */
  const divs = $('div[id^="question-summary-"]')
    .map((_index, element) => {
      return {id: $(element).attr("id")};
    })
    .get();

  /**
   * Returns the divs array.
   * @returns {Array} - The divs array.
   */
  return divs;
}

/**
 * Retrieves a question and its corresponding answer from a website based on the provided question ID.
 * @param {number} questionId - The ID of the question to retrieve.
 * @returns {Promise<{question: {title: string, body: string}, answer: {body: string}}>} - A promise that resolves to an object containing the question and answer.
 */
async function getQuestionAndAnswerById(questionId) {
  /**
   * Constructs a URL string with the given protocol.
   * @param {string} protocol - The protocol to use (e.g., "https").
   * @returns The constructed URL string.
   */
  const url = `https://stackoverflow.com/questions/${questionId}`;
  /**
   * Fetches the resource at the specified URL using the HTTP GET method.
   * @param {string} url - The URL of the resource to fetch.
   * @returns {Promise<Response>} - A promise that resolves to the response object representing the fetched resource.
   */
  const response = await fetch(url);
  /**
   * Retrieves the HTML content from the response object.
   * @param {Response} response - The response object from a fetch request.
   * @returns {Promise<string>} - A promise that resolves to the HTML content as a string.
   */
  const html = await response.text();

  /**
   * Load the given HTML string into a Cheerio object.
   * @param {string} html - The HTML string to load.
   * @returns A Cheerio object representing the parsed HTML.
   */
  const $ = cheerio.load(html);
  /**
   * Retrieves the text of the question title from the HTML element with the class "question-hyperlink".
   * @returns The text of the question title.
   */
  const questionTitle = $(".question-hyperlink").text();
  /**
   * Retrieves the text content of the question body element with the class "js-post-body".
   * @returns {string} The text content of the question body.
   */
  const questionBody = $(".js-post-body").text();
  /**
   * Retrieves the text content of the first element with the class "js-post-body" using jQuery.
   * @returns {string} The text content of the element.
   */
  const answerBody = $(".js-post-body").first().text();

  /**
   * Creates a new question object with the given title and body.
   * @param {string} questionTitle - The title of the question.
   * @param {string} questionBody - The body of the question.
   * @returns {Object} - The question object with the title and body properties.
   */
  const question = {title: questionTitle, body: questionBody};
  /**
   * Creates an object with a "body" property set to the provided answer body.
   * @param {string} answerBody - The body of the answer.
   * @returns {Object} - An object with a "body" property set to the provided answer body.
   */
  const answer = {body: answerBody};

  /**
   * Returns an object with a question and an answer.
   * @param {Object} question - the question to include in the object
   * @param {Object} answer - the answer to include in the object
   * @returns An object with a question and an answer.
   */
  return {question, answer};
}

/**
 * Handles GET requests to the root endpoint ("/").
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/", (req, res) => {
  /**
   * Sends a JSON response with the given body.
   * @param {object} body - The body of the response.
   */
  res.json({
    body: ":)",
  });
});

/**
 * Handles a GET request to the "/api" endpoint.
 * Retrieves questions based on the provided query parameters and returns a JSON response.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.get("/api", async (req, res) => {
  /**
   * Retrieves a list of questions based on the provided query parameters.
   * @param {string | null} question - The search query for the questions. If null, all questions will be returned.
   * @param {number} [page_number=1] - The page number of the results to retrieve. Defaults to 1.
   * @returns {Promise<Array<Question>>} - A promise that resolves to an array of Question objects.
   */
  const questions = await getQuestions(req.query.question ?? null, req.query.page_number ?? 1);
  /**
   * Retrieves the question and answer data for each question in the given array of question IDs,
   * and returns a JSON response containing the question ID, title, body, and answer for each question.
   * If the array of questions is empty, a 404 status code JSON response is returned.
   * @param {Array} questions - An array of question objects.
   * @returns A JSON response containing the question and answer data, or a 404 status code JSON response.
   */
  if (questions.length > 0) {
    const responseData = [];

    /**
     * Retrieves the question and answer data for each question in the given array of questions.
     * @param {Array} questions - An array of question objects.
     * @returns {Array} An array of objects containing the question and answer data.
     */
    for (let i = 0; i < questions.length; i++) {
      const questionId = questions[i].id.replace("question-summary-", "");
      const {question, answer} = await getQuestionAndAnswerById(questionId);
      if (!answer) return;
      responseData.push({
        id: questionId,
        title: question.title,
        body: question.body,
        answer: answer.body,
      });
    }

    /**
     * Sends a JSON response to the client.
     * @param {object} responseData - The data to send as the response.
     */
    res.json(responseData);
  } else {
    /**
     * Sets the HTTP response status code to 404 and sends a JSON response with the status code.
     * @param {number} status - The HTTP status code to set (404 in this case).
     * @param {object} json - The JSON object to send in the response.
     */
    res.status(404).json({
      status: 404,
    });
  }
});

/**
 * Starts the application server and listens for incoming requests on the specified port.
 * If the environment variable TOKEN is set, it will use that value as the port number.
 * Otherwise, it will default to port 3000.
 */
app.listen(process.env.TOKEN || 3000);
