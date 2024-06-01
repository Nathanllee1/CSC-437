/** @type {import('vite').UserConfig} */
export default {
    server: {
        proxy: {
            "/api": "http://localhost:3000",
            "/auth": "http://localhost:3000"
        }
    }
};