document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginSection = document.getElementById("login");
  const chatRoomSection = document.getElementById("chatRoom");

  const REMOTE_URL = "https://eagles-ec-be-development.onrender.com/api/v1/users/login";
  const port = window.location.port;

  const LOCAL_URL = `http://localhost:${port}/api/v1/users/login`;

  function getBaseUrl() {
    if (window.location.hostname === "localhost") {
      return LOCAL_URL;
    } else {
      return REMOTE_URL;
    }
  }
  const loginUser = async (email, password) => {
    try {
      const loginUrl = getBaseUrl();
      const response = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      localStorage.setItem("loginToken", JSON.stringify(data.token));
      showChatRoom();
    } catch (error) {
      console.error(error.message);
    }
  };

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await loginUser(email, password);
  });

  const showChatRoom = () => {
    loginSection.style.display = "none";
    chatRoomSection.style.display = "block";
  };
});
