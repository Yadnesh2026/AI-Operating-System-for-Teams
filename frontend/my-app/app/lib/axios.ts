import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers:{
        "Content-Type": "application/json"
    }
});

// Attach JWT token to every API request when available
api.interceptors.request.use(
    (config)=>{  //config is an object that contains information about the API request you're about to send. Means consist info about the route and where to push it 
        // Get JWT Token from localstorage
        const token = localStorage.getItem("token")

        // If token exists, attach it to request headers
        if(token){
            config.headers.Authorization = `Bearer ${token}`  // Adding this beacuse Backend needs the Bearror as auth from frontend to create JWT Token
        }

        // After modifying the request, we return config so Axios can continue with the updated configuration and send the request.
        return config;  
    },
    (error) => {
    if (error.response?.status === 401) {
      // Remove invalid or expired JWT
      localStorage.removeItem("token");

      // Redirect user to login page
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api


// Concept	Purpose
// JWT - Carries the user's identity
// localStorage - Stores the token in our current implementation
// Axios Interceptor - Automatically sends the token
// Auth Middleware - Verifies the token and identifies the user