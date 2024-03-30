// Dark mode toggle
const theme = document.getElementById("theme");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleDarkIcon = document.getElementById("theme-toggle-dark-icon");
const themeToggleLightIcon = document.getElementById("theme-toggle-light-icon");

// Change the theme based on local storage or user preference
const toggleTheme = () => {
  const isDarkMode = localStorage.getItem("color-theme") === "dark" || (!("color-theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDarkMode);

  // Toggle icon visibility inside button
  themeToggleDarkIcon.classList.toggle("hidden", !isDarkMode);
  themeToggleLightIcon.classList.toggle("hidden", isDarkMode);

  // Apply additional style when dark mode is on
  if (isDarkMode) {
    theme.style.filter = "invert(1) hue-rotate(180deg)";
    theme.style.backgroundColor = "#111827FF";
  } else {
    theme.style.filter = "none";
    theme.style.backgroundColor = "#fff";
  }
};

// Toggle theme on button click
themeToggleBtn.addEventListener("click", () => {
  const isDarkMode = document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", !isDarkMode);
  localStorage.setItem("color-theme", isDarkMode ? "light" : "dark");
  toggleTheme();
});

// Initial theme setup
toggleTheme();

function convertToAudio() {
  const fileInput = document.getElementById("pdfFileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a PDF file.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  fetch("http://127.0.0.1:5000/convert", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Conversion failed.");
      }
      return response.blob();
    })
    .then((audioBlob) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioPlayer = document.getElementById("audioPlayer");
      const audioName = document.getElementById("audioName");

      // Set the source and controls of the audio player
      audioPlayer.src = audioUrl;
      audioPlayer.controls = true;

      // Set the name of the audio player to be the same as the input file name
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Remove the file extension
      audioName.innerText = fileNameWithoutExtension + ".mp3"; // Set the name with the new extension
    })
    .catch((error) => {
      console.error("Conversion error:", error);
      alert("Conversion failed. Please try again.");
    });
}

// direct download
// function convertToAudio() {
//   const fileInput = document.getElementById("pdfFileInput");
//   const file = fileInput.files[0];

//   if (!file) {
//     alert("Please select a PDF file.");
//     return;
//   }

//   const formData = new FormData();
//   formData.append("file", file);

//   fetch("http://127.0.0.1:5000/convert", {
//     method: "POST",
//     body: formData,
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Conversion failed.");
//       }
//       return response.blob();
//     })
//     .then((audioBlob) => {
//       const audioUrl = URL.createObjectURL(audioBlob);
//       const downloadLink = document.createElement("a");
//       downloadLink.href = audioUrl;
//       downloadLink.setAttribute("download", "output.mp3"); // Set download attribute with filename
//       downloadLink.style.display = "none";
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//     })
//     .catch((error) => {
//       console.error("Conversion error:", error);
//       alert("Conversion failed. Please try again.");
//     });
// }
