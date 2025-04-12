// script.js

const grants = [
    { title: "NSF AI Research Institute", field: "ai", amount: 1000000, deadline: "2025-06-01", apply: "https://nsf.gov" },
    { title: "Google AI for Social Good", field: "ai", amount: 200000, deadline: "2025-05-20", apply: "https://research.google" },
    { title: "NIH Global Health Initiative", field: "health", amount: 500000, deadline: "2025-08-15", apply: "https://nih.gov" },
    { title: "WHO Tropical Disease Research", field: "health", amount: 400000, deadline: "2025-06-30", apply: "https://who.int" },
    { title: "Climate Innovation Grant (UNDP)", field: "climate", amount: 300000, deadline: "2025-07-01", apply: "https://undp.org" },
    { title: "EU Green Research", field: "climate", amount: 600000, deadline: "2025-10-10", apply: "https://europa.eu" }
  ];
  
  const searchInput = document.getElementById("searchInput");
  const suggestions = document.getElementById("suggestions");
  const results = document.getElementById("results");
  const bookmarks = document.getElementById("bookmarks");
  
  function daysUntil(dateStr) {
    const today = new Date();
    const deadline = new Date(dateStr);
    return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  }
  
  function suggestFields() {
    const input = searchInput.value.toLowerCase();
    const fields = ["AI", "Health", "Climate"];
    const match = fields.filter(f => f.toLowerCase().startsWith(input));
    suggestions.innerHTML = match.length ? "Suggestions: " + match.join(", ") : "";
  }
  
  function searchGrants() {
    const query = searchInput.value.toLowerCase();
    const minAmount = parseInt(document.getElementById("amountFilter").value);
    const maxDays = parseInt(document.getElementById("deadlineFilter").value);
  
    const filtered = grants.filter(grant => {
      const matchField = grant.field.toLowerCase().includes(query);
      const matchAmount = !minAmount || grant.amount >= minAmount;
      const matchDeadline = !maxDays || daysUntil(grant.deadline) <= maxDays;
      return matchField && matchAmount && matchDeadline;
    });
  
    results.innerHTML = filtered.length ? "" : `<div class="text-red-500">No matching grants found.</div>`;
  
    filtered.forEach(grant => {
      const card = document.createElement("div");
      card.className = "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow hover:shadow-lg transition";
  
      card.innerHTML = `
        <h3 class="text-xl font-bold text-indigo-700 dark:text-indigo-300">${grant.title}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300">Field: ${grant.field}</p>
        <p class="text-sm">💰 Amount: <strong>$${grant.amount.toLocaleString()}</strong></p>
        <p class="text-sm">📅 Deadline: <strong>${grant.deadline}</strong> (${daysUntil(grant.deadline)} days left)</p>
        <div class="mt-3 flex gap-3">
          <a href="${grant.apply}" target="_blank" class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold">Apply Now →</a>
          <button onclick="bookmarkGrant('${grant.title}')" class="text-indigo-600 dark:text-indigo-400 text-sm underline">Bookmark</button>
        </div>
      `;
      results.appendChild(card);
    });
  }
  
  function bookmarkGrant(title) {
    const grant = grants.find(g => g.title === title);
    const exists = localStorage.getItem(title);
    if (!exists) {
      localStorage.setItem(title, JSON.stringify(grant));
      displayBookmarks();
    }
  }
  
  function displayBookmarks() {
    bookmarks.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const grant = JSON.parse(localStorage.getItem(key));
      const item = document.createElement("div");
      item.className = "flex justify-between items-center border-b pb-1";
      item.innerHTML = `
        <span>${grant.title}</span>
        <button onclick="removeBookmark('${key}')" class="text-red-500 hover:underline text-sm">Remove</button>
      `;
      bookmarks.appendChild(item);
    }
  }
  
  function removeBookmark(title) {
    localStorage.removeItem(title);
    displayBookmarks();
  }
  
  function toggleDarkMode() {
    document.getElementById("body").classList.toggle("dark");
  }
  
  // Load bookmarks on start
  window.onload = displayBookmarks;
  