const esbuild = require("esbuild");

// 공통 빌드 함수
function buildFile(entryPoint, outputFile, watchMode = false) {
    esbuild
        .build({
            entryPoints: [entryPoint],
            bundle: true,
            outfile: outputFile,
            target: "es6",
            minify: true,
            sourcemap: true,
            watch: watchMode, // watch 모드를 옵션으로 설정
        })
        .then(() => console.log(`${outputFile} built successfully`))
        .catch(() => process.exit(1));
}

// 빌드 함수
function build() {
    buildFile("./src/scripts/index.ts", "./dist/js/index.js");
    buildFile("./src/scripts/pages/data-grid.ts", "./dist/js/data-grid.js");
}

// watch 모드 함수
function watch() {
    buildFile("./src/scripts/index.ts", "./dist/js/index.js", true);
    buildFile(
        "./src/scripts/pages/data-grid.ts",
        "./dist/js/data-grid.js",
        true
    );
}

// 명령어 인자에 따라 빌드 또는 감시 모드 실행
const args = process.argv.slice(2);
if (args.includes("--watch")) {
    watch();
} else {
    build();
}
