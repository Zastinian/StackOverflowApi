import cheerio from "cheerio";
import express from "express";

const app = express();

async function getQuestions(tag, page_number) {
  let url = "";
  if (tag == null) {
    url = `https://stackoverflow.com/questions?tab=active&page=${page_number}`;
  } else {
    url = `https://stackoverflow.com/questions/tagged/${tag}?tab=active&page=${page_number}`;
  }

  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const divs = $('div[id^="question-summary-"]')
    .map((index, element) => {
      return {id: $(element).attr("id")};
    })
    .get();

  return divs;
}

async function getQuestionAndAnswerById(questionId) {
  const url = `https://stackoverflow.com/questions/${questionId}`;
  const response = await fetch(url);
  const html = await response.text();

  const $ = cheerio.load(html);
  const questionTitle = $(".question-hyperlink").text();
  const questionBody = $(".js-post-body").text();
  const answerBody = $(".js-post-body").first().text();

  const question = {title: questionTitle, body: questionBody};
  const answer = {body: answerBody};

  return {question, answer};
}

app.get("/", async (req, res) => {
  const questions = await getQuestions(req.query.question ?? null, req.query.page_number ?? 1);
  if (questions.length > 0) {
    const responseData = [];

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

    res.json(responseData);
  } else {
    res.status(404).json({
      status: 404,
    });
  }
});

app.listen(process.env.TOKEN || 3000);
