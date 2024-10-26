import axiosInstance from "./url.service";

//signUp user
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//login user
export const loginUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/login", userData);
    return {
      status: "success", // Set the status explicitly
      data: response.data, // Assuming your API sends user data in response.data
    };
  } catch (error) {
    return {
      status: "error",
      data: error.response?.data || {}, // Provide some data for error cases
    };
  }
};

//login user
export const logout = async () => {
  try {
    const response = await axiosInstance.get("/auth/logout");
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//check auth api
export const checkUserAuth = async () => {
  try {
    const response = await axiosInstance.get("/users/check-auth"); // Add a leading slash
    if (response.data.status === "success") {
      return { isAuthenticated: true, user: response?.data?.data };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    console.log(error);
    return { isAuthenticated: false };
  }
};
