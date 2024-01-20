const storageKey = "STORAGE_KEY";
let editedBook = null; 

const formAddingBook = document.getElementById("inputBook");
const formSearchingBook = document.getElementById("searchBook");

function CheckForStorage() {
  return typeof Storage !== "undefined";
}


formAddingBook.addEventListener("submit", function (event) {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const page = parseInt(document.getElementById("inputBookPage").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const idTemp = document.getElementById("inputBookTitle").name;
  if (idTemp !== "") {
    const bookData = GetBookList();
    for (let index = 0; index < bookData.length; index++) {
      if (bookData[index].id == idTemp) {
        bookData[index].title = title;
        bookData[index].author = author;
        bookData[index].year = year;
        bookData[index].page = page;
        bookData[index].isComplete = isComplete;
      }
    }
    localStorage.setItem(storageKey, JSON.stringify(bookData));
    ResetAllForm();
    RenderBookList(bookData);
    return;
  }

  const id = JSON.parse(localStorage.getItem(storageKey)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(storageKey)).length + Date.now();
  const newBook = {
    id: id,
    title: title,
    author: author,
    year: year,
    page: page,
    isComplete: isComplete,
  };

  PutBookList(newBook);

  const bookData = GetBookList();
  RenderBookList(bookData);
});

const inputBookIsComplete = document.getElementById("inputBookIsComplete");
const bookSubmit = document.getElementById("bookSubmit");

inputBookIsComplete.addEventListener("change", function () {
  if (inputBookIsComplete.checked) {
    bookSubmit.innerHTML = "Masukkan Buku ke rak <strong>Selesai dibaca</strong>";
  } else {
    bookSubmit.innerHTML = "Masukkan Buku ke rak";
  }
});

function PutBookList(data) {
  if (CheckForStorage()) {
    let bookData = [];

    if (localStorage.getItem(storageKey) !== null) {
      bookData = JSON.parse(localStorage.getItem(storageKey));
    }

    bookData.push(data);
    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }
}

function RenderBookList(bookData) {
  if (bookData === null) {
    return;
  }

  const containerIncomplete = document.getElementById("incompleteBookshelfList");
  const containerComplete = document.getElementById("completeBookshelfList");

  containerIncomplete.innerHTML = "";
  containerComplete.innerHTML = "";
  for (let book of bookData) {
    const id = book.id;
    const title = book.title;
    const author = book.author;
    const year = book.year;
    const page = book.page;
    const isComplete = book.isComplete;

    //create isi item
    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";
    bookItem.innerHTML += "<p>Halaman: " + page + "</p>";
    bookItem.childNodes[0].addEventListener("click", function (event) {
      editedBook = book;
      UpdateAnItem(event.target.parentElement);
    });

    //container action item
    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    //green button
    const greenButton = CreateGreenButton(book, function (event) {
      isCompleteBookHandler(book);
    
      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });    

    //red button
    const redButton = CreateRedButton(function (event) {
      DeleteAnItem(event.target.parentElement.parentElement);

      const bookData = GetBookList();
      ResetAllForm();
      RenderBookList(bookData);
    });

    containerActionItem.append(greenButton, redButton);

    bookItem.append(containerActionItem);

    //incomplete book
    if (isComplete === false) {
      containerIncomplete.append(bookItem);
      bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateAnItem(event.target.parentElement);
      });

      continue;
    }

    //complete book
    containerComplete.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
      UpdateAnItem(event.target.parentElement);
    });
  }
}

function CreateGreenButton(book, eventListener) {
  const isSelesai = book.isComplete ? "Belum selesai" : "Selesai";

  const greenButton = document.createElement("button");
  greenButton.classList.add("green");
  greenButton.innerText = isSelesai + " di Baca";
  greenButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return greenButton;
}
function CreateRedButton(eventListener) {
  const redButton = document.createElement("button");
  redButton.classList.add("red");
  redButton.innerText = "Hapus buku";
  redButton.addEventListener("click", function (event) {
    eventListener(event);
  });
  return redButton;
}

function isCompleteBookHandler(book) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == book.id) {
      bookData[index].isComplete = !bookData[index].isComplete;
      break;
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function SearchBookList(title) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const bookList = [];

  for (let index = 0; index < bookData.length; index++) {
    const tempTitle = bookData[index].title.toLowerCase();
    const tempTitleTarget = title.toLowerCase();
    if (bookData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
      bookList.push(bookData[index]);
    }
  }
  return bookList;
}

function GreenButtonHandler(parentElement) {
  let book = isCompleteBookHandler(parentElement);
  book.isComplete = !book.isComplete;
}

function GetBookList() {
  if (CheckForStorage) {
    return JSON.parse(localStorage.getItem(storageKey));
  }
  return [];
}

function DeleteAnItem(itemElement) {
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
  for (let index = 0; index < bookData.length; index++) {
    if (bookData[index].id == titleNameAttribut) {
      bookData.splice(index, 1);
      break;
    }
  }

  localStorage.setItem(storageKey, JSON.stringify(bookData));
}

function UpdateAnItem(itemElement) {
  if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
    return;
  }

  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const id = itemElement.childNodes[0].getAttribute("name");
  const book = bookData.find((book) => book.id == id);

  if (book) {
    document.getElementById("inputBookTitle").name = book.id;
    document.getElementById("inputBookTitle").value = editedBook ? editedBook.title : book.title;
    document.getElementById("inputBookAuthor").value = editedBook ? editedBook.author : book.author;
    document.getElementById("inputBookYear").value = editedBook ? editedBook.year : book.year;
    document.getElementById("inputBookPage").value = editedBook ? editedBook.page : book.page;
    document.getElementById("inputBookIsComplete").checked = editedBook ? editedBook.isComplete : book.isComplete;
  }
}


searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  const bookData = GetBookList();
  if (bookData.length === 0) {
    return;
  }

  const title = document.getElementById("searchBookTitle").value;
  if (title === null) {
    RenderBookList(bookData);
    return;
  }
  const bookList = SearchBookList(title);
  RenderBookList(bookList);
});

function ResetAllForm() {
  document.getElementById("inputBookTitle").value = "";
  document.getElementById("inputBookAuthor").value = "";
  document.getElementById("inputBookYear").value = "";
  document.getElementById("inputBookPage") .value = "";
  document.getElementById("inputBookIsComplete").checked = false;

  document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
  if (CheckForStorage) {
    if (localStorage.getItem(storageKey) !== null) {
      const bookData = GetBookList();
      RenderBookList(bookData);
    }
  } else {
    alert("Browser yang Anda gunakan tidak mendukung Web Storage");
  }
});
