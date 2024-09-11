const esbuild = require("esbuild");

// 빌드 함수
function build() {
    esbuild
        .build({
            entryPoints: ["./src/index.ts"],
            bundle: true,
            outfile: "./dist/index.js",
            target: "es6",
        })
        .catch(() => process.exit(1));

    esbuild
        .build({
            entryPoints: ["./src/data-grid.ts"],
            bundle: true,
            outfile: "./dist/data-grid.js",
            target: "es6",
        })
        .catch(() => process.exit(1));
}

// watch 모드
function watch() {
    esbuild
        .build({
            entryPoints: ["./src/index.ts"],
            bundle: true,
            outfile: "./dist/index.js",
            target: "es6",
            watch: true,
        })
        .catch(() => process.exit(1));
}

// 명령어 인자에 따라 빌드 또는 감시 모드 실행
const args = process.argv.slice(2);
if (args.includes("--watch")) {
    watch();
} else {
    build();
}
