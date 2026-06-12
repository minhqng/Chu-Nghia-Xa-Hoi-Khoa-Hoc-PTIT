import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourceDirs = ["Ngân Hàng Câu Hỏi", "Ôn Tập Lý Thuyết"];
const ids = new Set();
const issues = [];
let total = 0;

function pushIssue(file, index, message) {
  issues.push(`${file} #${index + 1}: ${message}`);
}

for (const source of sourceDirs) {
  const sourcePath = path.join(root, source);
  const files = (await readdir(sourcePath)).filter((file) => file.endsWith(".json")).sort();

  for (const file of files) {
    const filePath = path.join(sourcePath, file);
    const raw = await readFile(filePath, "utf8");
    const questions = JSON.parse(raw);
    const chapter = file.match(/\d+/)?.[0] ?? file.replace(".json", "");

    if (!Array.isArray(questions)) {
      issues.push(`${source}/${file}: expected top-level array`);
      continue;
    }

    questions.forEach((question, index) => {
      total += 1;
      const id = `${source}:${chapter}:${index + 1}`;
      const label = `${source}/${file}`;

      if (ids.has(id)) pushIssue(label, index, `duplicate id ${id}`);
      ids.add(id);

      if (!String(question.question_text ?? "").trim()) {
        pushIssue(label, index, "missing question_text");
      }

      if (!Array.isArray(question.answers)) {
        pushIssue(label, index, "answers is not an array");
        return;
      }

      if (![2, 4].includes(question.answers.length)) {
        pushIssue(label, index, `expected 2 or 4 answers, found ${question.answers.length}`);
      }

      const correctCount = question.answers.filter((answer) => Number(answer.weight) > 0).length;
      if (correctCount !== 1) pushIssue(label, index, `expected 1 correct answer, found ${correctCount}`);

      question.answers.forEach((answer, answerIndex) => {
        if (!String(answer.text ?? "").trim()) {
          pushIssue(label, index, `answer ${answerIndex + 1} is empty`);
        }
      });
    });
  }
}

if (issues.length > 0) {
  console.error(`Data validation failed with ${issues.length} issue(s):`);
  issues.slice(0, 100).forEach((issue) => console.error(`- ${issue}`));
  if (issues.length > 100) console.error(`- ...and ${issues.length - 100} more`);
  process.exit(1);
}

console.log(`Data validation passed: ${total} questions across ${sourceDirs.length} sources.`);
