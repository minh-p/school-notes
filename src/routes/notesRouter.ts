import express, { Response } from 'express';
import markdown from '../lib/markdown';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const CONTENT_DIR = path.join(__dirname, '../content');
const INFO_DIR = path.join(CONTENT_DIR, "Courses-Information")
const CONCEPTS_DIR = path.join(CONTENT_DIR, "Courses-Concepts")

type MarkdownMetadata = {
  title?: string,
  dateString?: string,
  date?: string,
  summary?: string
};

interface Note extends MarkdownMetadata {
  link: string,
};

const extractMetadataFromMarkdown = (markdownString: string): MarkdownMetadata | undefined => {
  const charactersBetweenGroupedHyphens = /^---([\s\S]*?)---/;
  const metadataMatched = markdownString.match(charactersBetweenGroupedHyphens);
  if (!metadataMatched) return;
  const metadata = metadataMatched[1];

  if (!metadata) {
    return {};
  }

  const metadataLines: string[] = metadata.split("\n");

  const metadataObject: MarkdownMetadata = metadataLines.reduce((accumulator: { [key: string]: string }, line) => {
    accumulator = accumulator as MarkdownMetadata;
    const [key, ...value] = line.split(":").map((part) => part.trim());
    if (key)
      accumulator[key] = value[1] ? value.join(":") : value.join("");
    return accumulator;
  }, {});

  return metadataObject;
};

const formatDate = (date: string, longDay?: boolean): string => {
  if (longDay) {
    return new Date(date).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "2-digit"});
  }
  return new Date(date).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "2-digit"});
}

const getInfo = (res: Response, dir: string): Note[] => {
  const files = fs.readdirSync(dir);
  const notes: Note[] = [];
  files.forEach(file => {
    let noteVars: Note;
    const markdownMetadata: MarkdownMetadata | undefined = extractMetadataFromMarkdown(fs.readFileSync(path.join(dir, `${file}`)).toString());
    if (!markdownMetadata) {
      noteVars = {
        link: `/notes/${path.parse(dir).name}/${path.parse(file).name}`
      }
    } else {
      noteVars = {
        date: markdownMetadata.date ? formatDate(markdownMetadata.date) : undefined,
        dateString: markdownMetadata.date,
        title: markdownMetadata.title || 'Unnamed Note',
        link: `/entries/${path.parse(file).name}`,
        summary: markdownMetadata.summary ? markdownMetadata.summary : undefined
      }
    }
    notes.push(noteVars);
  })

  return notes;
}

router.get('/', (_, res: Response) => {
  const coursesInfo: Note[] = getInfo(res, INFO_DIR);
  const coursesConcepts: Note[] = getInfo(res, CONCEPTS_DIR);

  res.render('indexNotes', {
    title: 'Content | HMP School Notes',
    coursesInfo,
    coursesConcepts
  });
});

router.get('/Courses-Information', (_, res: Response) => {
  const notes: Note[] = getInfo(res, INFO_DIR);
  res.render('notes', {
    title: 'Courses Under My Belt | HMP School Notes',
    shortTitle: 'Courses Information',
    notes
  });
});

router.get('/Courses-Concepts', (_, res: Response) => {
  const notes: Note[] = getInfo(res, CONCEPTS_DIR);
  res.render('notes', {
    title: 'Recorded Course Concepts | HMP School Notes',
    shortTitle: 'Courses Concepts',
    notes
  });
});

export default router;
