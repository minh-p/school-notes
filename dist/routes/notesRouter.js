"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (_, res) => {
    res.render('indexNotes', {
        title: 'Content | HMP School Notes',
    });
});
router.get('/courses-information', (_, res) => {
    res.render('notes', {
        title: 'Courses Under My Belt | HMP School Notes'
    });
});
router.get('/courses-concepts', (_, res) => {
    res.render('notes', { title: 'Recorded Course Concepts | HMP School Notes' });
});
exports.default = router;
