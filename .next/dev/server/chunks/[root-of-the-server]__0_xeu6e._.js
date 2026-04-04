module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/create-checkout-session.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$stripe$29$__ = __turbopack_context__.i("[externals]/stripe [external] (stripe, esm_import, [project]/node_modules/stripe)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$stripe$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$stripe$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        return res.status(500).json({
            error: "Missing STRIPE_SECRET_KEY in server environment"
        });
    }
    const stripe = new __TURBOPACK__imported__module__$5b$externals$5d2f$stripe__$5b$external$5d$__$28$stripe$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$stripe$29$__["default"](secretKey);
    try {
        const { checkoutData, origin } = req.body;
        if (!checkoutData || !checkoutData.items || !checkoutData.customer) {
            return res.status(400).json({
                error: "Missing checkout data"
            });
        }
        const line_items = checkoutData.items.map((item)=>({
                price_data: {
                    currency: "cad",
                    product_data: {
                        name: item.title,
                        images: item.image ? [
                            item.image
                        ] : [],
                        metadata: {
                            productId: item.id,
                            category: item.category || ""
                        }
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            }));
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: [
                "card"
            ],
            customer_email: checkoutData.customer.email,
            line_items,
            success_url: `${origin}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout`,
            metadata: {
                fullName: checkoutData.customer.fullName,
                email: checkoutData.customer.email,
                addressLine1: checkoutData.customer.addressLine1,
                city: checkoutData.customer.city,
                province: checkoutData.customer.province,
                postalCode: checkoutData.customer.postalCode
            }
        });
        return res.status(200).json({
            url: session.url
        });
    } catch (error) {
        console.error("Stripe checkout session error:", error);
        return res.status(500).json({
            error: error.message || "Failed to create Stripe Checkout session"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0_xeu6e._.js.map