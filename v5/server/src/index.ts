import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// 클라이언트 정적 파일 서빙
app.use(express.static(path.join(__dirname, "../../client/dist")));

// 기본 경로 처리
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

// data-grid 페이지 경로 처리
app.get("/data-grid", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/data-grid.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// import express from "express";
// import cors from "cors";

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors()); // CORS 허용
// app.use(express.json());

// // 간단한 API 엔드포인트
// app.get("/api/hello", (req, res) => {
//     res.json({ message: "Hello from the server!" });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
