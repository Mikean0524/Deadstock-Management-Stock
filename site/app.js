const sidebar=document.getElementById("sidebar");
const menuButton=document.getElementById("menu-button");
const pageTitle=document.getElementById("page-title");
const links=[...document.querySelectorAll(".sidebar nav a[href^='#']")];
menuButton?.addEventListener("click",()=>sidebar.classList.toggle("open"));
links.forEach(link=>link.addEventListener("click",()=>{sidebar.classList.remove("open");links.forEach(item=>item.classList.remove("active"));link.classList.add("active");pageTitle.textContent=link.dataset.page||"Home";}));
const input=document.getElementById("search-input");
input?.addEventListener("input",()=>{const term=input.value.toLowerCase().trim();document.querySelectorAll("article section").forEach(section=>{section.style.display=!term||section.textContent.toLowerCase().includes(term)?"block":"none";});});
