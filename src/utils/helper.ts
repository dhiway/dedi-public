// Global store for current environment
let currentEnvironment: string | null = null;

// Initialize the environment from URL on load
export function initializeEnvironment() {
    const params = new URLSearchParams(window.location.search);
    const envParam = params.get("env");
    
    // Update: allow custom as valid environment
    if (envParam === "beta" || envParam === "dev" || envParam === "sandbox" || envParam === "custom") {
        currentEnvironment = envParam;
    } else {
        currentEnvironment = "sandbox"; // Default
    }
    
    return currentEnvironment;
}

// Get the current environment
export function getCurrentEnvironment(): string {
    if (currentEnvironment === null) {
        initializeEnvironment();
    }
    return currentEnvironment || "sandbox";
}

// Update the current environment
export function setCurrentEnvironment(env: string) {
    // Update: allow custom environment
    if (env === "beta" || env === "dev" || env === "sandbox" || env === "custom") {
        currentEnvironment = env;
    }
}

export function timeAgo(updatedAt: string): string {
    const updatedDate = new Date(updatedAt);
    const currentDate = new Date();
    
    const timeDiff = currentDate.getTime() - updatedDate.getTime();
    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    if (daysAgo === 0) {
        return "Today";
    } else if (daysAgo === 1) {
        return "Yesterday";
    } else {
        return `${daysAgo} days ago`;
    }
}

export function normalization(inputString:string){
    const cleanString = inputString.replace(/[_-]/g, ' ');
    const stringList = cleanString.split(" ");
    const normalizedList = stringList.map((key)=> {
            return key.charAt(0).toUpperCase() + key.slice(1);
        });
    return normalizedList.toString().replace(/,/g," ");
}

export function getApiEndpoint(): string {
    const env = getCurrentEnvironment();

    let endpoint = import.meta.env.VITE_API_SANDBOX_ENDPOINT || "https://sandbox.dedi.global";
    
    if (env === "custom") {
        const params = new URLSearchParams(window.location.search);
        const customEndpoint = params.get("customEndpoint");
        endpoint = customEndpoint || endpoint;
    } else if (env === "beta") {
        endpoint = import.meta.env.VITE_API_BETA_ENDPOINT || "https://beta.dedi.global";
    } else if (env === "dev") {
        endpoint = import.meta.env.VITE_API_DEV_ENDPOINT || "https://dev.dedi.global";
    }
    
    return endpoint;
}