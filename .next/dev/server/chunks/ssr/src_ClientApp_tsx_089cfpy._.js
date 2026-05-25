module.exports = [
"[project]/src/ClientApp.tsx [ssr] (ecmascript, next/dynamic entry, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/src_0wutil-._.js",
  "server/chunks/ssr/[externals]__0ebcxtt._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/src/ClientApp.tsx [ssr] (ecmascript, next/dynamic entry)");
    });
});
}),
];