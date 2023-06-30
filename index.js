import {launch} from "puppeteer";
import express from "express";

const app = express();

const browser = await launch({
  headless: "true",
});
const page = await browser.newPage();

async function getQuestions(tag, page_number) {
  if (tag == null) {
    await page.goto(`https://stackoverflow.com/questions?tab=active&page=${page_number}`);
  } else {
    await page.goto(`https://stackoverflow.com/questions/tagged/${tag}?tab=active&page=${page_number}`);
  }

  const divs = await page.evaluate(() => {
    const divElements = Array.from(document.querySelectorAll('div[id^="question-summary-"]'));

    const divs = divElements.map((divElement) => {
      return {id: divElement.id};
    });

    return divs;
  });

  return divs;
}

async function getQuestionAndAnswerById(questionId) {
  await page.goto(`https://stackoverflow.com/questions/${questionId}`);

  const question = await page.evaluate(() => {
    const questionTitle = document.querySelector(".question-hyperlink").innerText;
    const questionBody = document.querySelector(".js-post-body").innerText;

    return {title: questionTitle, body: questionBody};
  });

  const answer = await page.evaluate(() => {
    const answerBody = document.querySelector(".js-post-body").innerText;

    return {body: answerBody};
  });
  return {question, answer};
}

app.get("/", async (req, res) => {
  const questions = await getQuestions(req.query.question ?? null, req.query.page_number ?? 1);
  if (questions.length > 0) {
    const questionId = questions[0].id.replace("question-summary-", "");
    const {question, answer} = await getQuestionAndAnswerById(questionId);
    res.json({
      id: questionId,
      title: question.title,
      body: question.body,
      answer: answer.body,
    });
  } else {
    res.status(404).json({
      status: 404,
    });
  }
});

app.listen(process.env.TOKEN || 3000);
