"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const livereload_1 = __importDefault(require("livereload"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const morgan_1 = __importDefault(require("morgan"));
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const notesRouter_1 = __importDefault(require("./routes/notesRouter"));
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
if (process.env.NODE_ENV === 'development') {
    const liveReloadServer = livereload_1.default.createServer();
    liveReloadServer.watch(path_1.default.join(__dirname, 'public'));
    liveReloadServer.server.once('connection', () => {
        setTimeout(() => {
            console.log("Hello");
            liveReloadServer.refresh("/");
        }, 100);
    });
    app.use((0, connect_livereload_1.default)());
    app.use((0, morgan_1.default)('dev'));
}
app.set('view engine', 'pug');
app.set('views', path_1.default.join(__dirname, "views"));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', indexRouter_1.default);
app.use('/notes', notesRouter_1.default);
app.listen(port, () => {
    console.log(`[server]: Server is running at https://localhost:${port}`);
});
