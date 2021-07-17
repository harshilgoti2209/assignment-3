import { displayItems } from "./data.js";

let currentImageIndex = 0;
let currentlyLoadedItems = 0;
let totalItems = displayItems.length;
const sidebar = document.querySelector(".sidebar");

const applyBackgroundColor = (index) => {
  const element = document.getElementById(`${index}`);
  element.classList.add("selected");
};
const removeBackgroundColor = (index) =>
  document.getElementById(`${index}`).classList.remove("selected");

const displayImage = () => {
  let imagePhoto = document.querySelector("#image-photo");
  imagePhoto.src = displayItems[currentImageIndex].previewImage;
  imagePhoto.alt = displayItems[currentImageIndex].title;
  let imageTitle = document.querySelector("#image-title");
  imageTitle.innerHTML = displayItems[currentImageIndex].title;
};

const fixTitle = (item, index) => {
  let title = displayItems[index].title;
  item.textContent = title;
  if (item.scrollWidth <= item.clientWidth) {
    return;
  }
  let minLength = 1,
    maxLength = title.length;
  while (minLength < maxLength) {
    let midLength = (minLength + maxLength) / 2;
    item.textContent =
      title.substr(0, Math.floor(midLength / 2)) +
      "..." +
      title.substr(-Math.floor(midLength / 2));
    item.scrollWidth > item.clientWidth
      ? (maxLength = midLength - 1)
      : (minLength = midLength);
  }
  item.textContent =
    title.substr(0, Math.floor(maxLength / 2)) +
    "..." +
    title.substr(-Math.floor(maxLength / 2));
};

const loadMoreItems = (limit) => {
  let loadItems = Math.min(totalItems, currentlyLoadedItems + limit);
  for (let index = currentlyLoadedItems; index < loadItems; index++) {
    let item = displayItems[index];
    let element = document.createElement("div");
    element.classList.add("sidebar-item");
    element.id = index;
    element.innerHTML = `
    <img
      src="${item.previewImage}"
      alt="${item.title}"
      class="image-preview"
    />
    <p class="item-title" id='title-${index}'>${item.title}</p>
    `;
    element.onclick = () => {
      removeBackgroundColor(currentImageIndex);
      currentImageIndex = index;
      displayImage();
      applyBackgroundColor(currentImageIndex);
    };
    sidebar.appendChild(element);
    const title = document.querySelector(`#title-${index}`);
    fixTitle(title, index);
  }
  currentlyLoadedItems = loadItems;
};

const fitImageTitle = () => {
  const sidebar = document.querySelectorAll(`.item-title`);
  sidebar.forEach(fixTitle);
};

window.onresize = fitImageTitle;
window.onload = fitImageTitle;

document.onkeydown = function (event) {
  removeBackgroundColor(currentImageIndex);

  var e = event || window.event;
  e.preventDefault();
  if (currentImageIndex !== 0 && e.keyCode === 38) {
    //UP KEY
    currentImageIndex = currentImageIndex - 1;
  } else if (currentImageIndex !== totalItems - 1 && e.keyCode === 40) {
    //DOWN KEY
    currentImageIndex = currentImageIndex + 1;
  }
  if (currentImageIndex == currentlyLoadedItems) {
    loadMoreItems(5);
  }
  displayImage();
  applyBackgroundColor(currentImageIndex);
  sidebar.scrollTop = 82 * (currentImageIndex - 4);
};

sidebar.addEventListener("scroll", () => {
  const { clientHeight, scrollTop, scrollHeight } = sidebar;
  if (scrollTop + clientHeight + 250 >= scrollHeight) {
    loadMoreItems(10);
  }
});

loadMoreItems(20);
applyBackgroundColor(currentImageIndex);
displayImage();
