// Global store for current environment
let currentEnvironment: string | null = null;

// Get dropdown options from environment variables
const getDropdownOptions = () => {
    const productionOption = import.meta.env.VITE_PRODUCTION_DROPDOWN_OPTION || "Production";
    const developmentOption = import.meta.env.VITE_DEVELOPMENT_DROPDOWN_OPTION || "Development";
    return { productionOption, developmentOption };
};

// Initialize the environment from URL on load
export function initializeEnvironment() {
    const params = new URLSearchParams(window.location.search);
    const envParam = params.get("env");
    const { productionOption, developmentOption } = getDropdownOptions();
    
    // Check if the environment parameter matches our configured options
    if (envParam === productionOption || envParam === developmentOption) {
        currentEnvironment = envParam;
    } else {
        currentEnvironment = productionOption; // Default to production
    }
    
    return currentEnvironment;
}

// Get the current environment
export function getCurrentEnvironment(): string {
    if (currentEnvironment === null) {
        initializeEnvironment();
    }
    const { productionOption } = getDropdownOptions();
    return currentEnvironment || productionOption;
}

// Update the current environment
export function setCurrentEnvironment(env: string) {
    const { productionOption, developmentOption } = getDropdownOptions();
    if (env === productionOption || env === developmentOption) {
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

// Export function to get dropdown options for use in components
export function getEnvironmentOptions() {
    return getDropdownOptions();
}

export function getApiEndpoint(): string {
    const env = getCurrentEnvironment();
    const { productionOption, developmentOption } = getDropdownOptions();

    let endpoint: string;
    
    if (env === developmentOption) {
        endpoint = import.meta.env.VITE_DEVELOPMENT_BACKEND_URL || "http://localhost:5106";
        console.log(`🔧 Using development backend URL: ${endpoint}`);
    } else {
        endpoint = import.meta.env.VITE_PRODUCTION_BACKEND_URL || "https://sandbox.dedi.global";
        console.log(`🔧 Using production backend URL: ${endpoint}`);
    }
    
    console.log(`🌐 API Endpoint: ${endpoint} (env: ${env})`);
    return endpoint;
}