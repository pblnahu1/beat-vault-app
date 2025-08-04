const logger = (message, type = "info", nodeEnv = "unknown") => {
    const timestamp = new Date().toLocaleDateString();

    const envLabel = {
        local: "[LOCAL]",
        docker: "[DOCKER]",
        production: "[PROD_SUPABASE]",
    }[nodeEnv] || "[UNKNOWN ENV]";

    const typeColor = {
        info: "\x1b[36m%s\x1b[0m",      // cyan
        success: "\x1b[32m%s\x1b[0m",   // green
        warning: "\x1b[33m%s\x1b[0m",   // yellow
        error: "\x1b[31m%s\x1b[0m",     // red
    }[type] || "\x1b[0m%s";

    console.log(typeColor, `${envLabel} [${timestamp}] ${message}`);
};

export default logger;