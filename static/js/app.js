(function () {
  "use strict";

  var Telegram = window.Telegram && window.Telegram.WebApp;
  if (Telegram) {
    Telegram.ready();
    Telegram.expand();
  }

  var screens = {
    welcome: "screen-welcome",
    main: "screen-main",
    preparation: "screen-preparation",
    dentist: "screen-dentist",
    blood: "screen-blood",
    "story-dentist": "screen-story-dentist",
    "story-blood": "screen-story-blood",
    "recommendations-dentist": "screen-recommendations-dentist",
    booking: "screen-booking",
  };

  // Социстория «Иду к стоматологу»: слайды 2–30 из docx (титул 1 пропущен), картинки 02–30 строго по документу
  var dentistStory = [
    { text: "Я иду в стоматологию, чтобы врач проверил мои зубки.", image: "images/story-dentist/dentist-slide-01.png" },
    { text: "Когда я приду в стоматологию, я надену бахилы.", image: "images/story-dentist/dentist-slide-02.jpeg" },
    { text: "Потом я сдам куртку в гардероб.", image: "images/story-dentist/dentist-slide-03.png" },
    { text: "Я пойду с мамой в регистратуру, чтобы врач узнал, что я пришел.", image: "images/story-dentist/dentist-slide-04.jpeg" },
    { text: "После этого, я буду сидеть спокойно и ждать своей очереди. В холле может быть шумно.", image: "images/story-dentist/dentist-slide-05.jpeg" },
    { text: "Когда меня позовут, я зайду в кабинет", image: "images/story-dentist/dentist-slide-06.jpeg" },
    { text: "Там меня встретит врач-стоматолог", image: "images/story-dentist/dentist-slide-07.jpeg" },
    { text: "Я поздороваюсь с врачом", image: "images/story-dentist/dentist-slide-08.jpeg" },
    { text: "Доктор пригласит меня сесть в кресло", image: "images/story-dentist/dentist-slide-09.jpeg" },
    { text: "Я сяду в кресло, как скажет доктор.", image: "images/story-dentist/dentist-slide-10.jpeg" },
    { text: "Кресло может двигаться вниз и вверх", image: "images/story-dentist/dentist-slide-11.jpeg" },
    { text: "Я положу голову на подголовник, а ноги ровно положу на подставку", image: "images/story-dentist/dentist-slide-12.jpeg" },
    { text: "Я буду сидеть спокойно, потому что это нестрашно", image: "images/story-dentist/dentist-slide-13.jpeg" },
    { text: "Над креслом висит большая яркая лампа. Она нужна врачу, чтобы лучше видеть.", image: "images/story-dentist/dentist-slide-14.png" },
    { text: "Врач наденет на меня салфетку.", image: "images/story-dentist/dentist-slide-15.jpeg" },
    { text: "Врач наденет перчатки", image: "images/story-dentist/dentist-slide-16.jpeg" },
    { text: "Во время приема я не буду хватать врача за руки, чтобы не мешать", image: "images/story-dentist/dentist-slide-17.jpeg" },
    { text: "Я не буду кусаться", image: "images/story-dentist/dentist-slide-18.jpeg" },
    { text: "Врач будет использовать специальные инструменты, чтобы осмотреть меня", image: "images/story-dentist/dentist-slide-19.jpeg" },
    { text: "Врач попросит меня открыть рот и я выполню его просьбу.", image: "images/story-dentist/dentist-slide-20.jpeg" },
    { text: "Доктор осмотрит мои зубки с помощью зеркала. Это не больно.", image: "images/story-dentist/dentist-slide-21.jpeg" },
    { text: "Врач может использовать специальный инструмент, чтобы полечить мои зубы. Он шумит.", image: "images/story-dentist/dentist-slide-22.jpeg" },
    { text: "Я прополощу рот и выплюну воду, когда доктор скажет.", image: "images/story-dentist/dentist-slide-23.jpeg" },
    { text: "Врач может поставить мне в рот трубку для отвода слюны и воды. Она может шуметь.", image: "images/story-dentist/dentist-slide-24.jpeg" },
    { text: "Врач польет водичкой на мои зубы чтобы они стали чистыми", image: "images/story-dentist/dentist-slide-25.jpeg" },
    { text: "Врач посушит мои зубки воздухом, чтобы они стали сухими", image: "images/story-dentist/dentist-slide-26.jpeg" },
    { text: "Осмотр окончен.", image: "images/story-dentist/dentist-slide-27.jpeg" },
    { text: "Врач расскажет мне, как ухаживать за зубками.", image: "images/story-dentist/dentist-slide-28.jpeg" },
    { text: "Я молодец! Теперь мои зубы будут здоровы.", image: "images/story-dentist/dentist-slide-29.jpeg" },
    { text: "Врач даст мне подарок!", image: "images/story-dentist/dentist-slide-30.jpeg" }
  ];

  var bloodStory = [
    { text: "Я иду в поликлинику, чтобы сдать анализ крови.", image: "images/story-blood/blood-slide-01.png" },
    { text: "Я сдам куртку в гардероб.", image: "images/story-blood/blood-slide-02.png" },
    { text: "Перед сдачей крови я не буду есть кашу, бутерброды и яичницу. Я выпью воду.", image: "images/story-blood/blood-slide-03.png" },
    { text: "В гардеробе мама сдаст нашу верхнюю одежду.", image: "images/story-blood/blood-slide-04.png" },
    { text: "Мы подойдём в регистратуру.", image: "images/story-blood/blood-slide-05.png" },
    { text: "Я надену бахилы.", image: "images/story-blood/blood-slide-06.png" },
    { text: "Мама и я в гардеробе. Мы надеваем бахилы.", image: "images/story-blood/blood-slide-07.png" },
    { text: "Мама поможет мне надеть бахилы.", image: "images/story-blood/blood-slide-08.png" },
    { text: "Врач пригласит меня сесть в кресло.", image: "images/story-blood/blood-slide-09.png" },
    { text: "Я сяду в кресло.", image: "images/story-blood/blood-slide-10.png" },
    { text: "Мы подойдём к стойке, чтобы сдать одежду.", image: "images/story-blood/blood-slide-11.png" },
    { text: "Я надену бахилы перед входом.", image: "images/story-blood/blood-slide-12.png" },
    { text: "В гардеробе я сдам куртку.", image: "images/story-blood/blood-slide-13.png" },
    { text: "Врач наденет перчатки.", image: "images/story-blood/blood-slide-14.png" },
    { text: "Врач наложит повязку на место, где была иголка.", image: "images/story-blood/blood-slide-15.png" },
    { text: "Я молодец! После сдачи крови мне дадут сладкое.", image: "images/story-blood/blood-slide-16.png" },
    { text: "Врач подарит мне подарок!", image: "images/story-blood/blood-slide-17.png" },
    { text: "Мы пойдём домой после процедуры.", image: "images/story-blood/blood-slide-18.png" },
    { text: "Я поздороваюсь с врачом.", image: "images/story-blood/blood-slide-19.png" },
    { text: "Мы будем ждать своей очереди в коридоре.", image: "images/story-blood/blood-slide-20.png" },
    { text: "В регистратуре нас запишут.", image: "images/story-blood/blood-slide-21.png" },
    { text: "Я зайду в кабинет и поздороваюсь.", image: "images/story-blood/blood-slide-22.png" },
    { text: "После процедуры мы пойдём домой.", image: "images/story-blood/blood-slide-23.png" },
    { text: "Врач наложит мне повязку.", image: "images/story-blood/blood-slide-24.png" },
    { text: "Мне дадут сладкое — я молодец!", image: "images/story-blood/blood-slide-25.png" },
    { text: "Мы идём по коридору после процедуры.", image: "images/story-blood/blood-slide-26.png" },
    { text: "Я зайду и поздороваюсь.", image: "images/story-blood/blood-slide-27.png" },
    { text: "Всё готово! Я справился.", image: "images/story-blood/blood-slide-28.png" }
  ];

  var currentStoryIndex = 0;
  var currentStorySlides = null;

  function showScreen(screenId) {
    var id = screens[screenId] || screenId;
    document.querySelectorAll(".screen").forEach(function (el) {
      el.classList.remove("active");
    });
    var el = document.getElementById(id);
    if (el) el.classList.add("active");

    if (screenId === "story-dentist") {
      currentStoryIndex = 0;
      currentStorySlides = dentistStory;
      renderStorySlide("dentist");
    }
    if (screenId === "story-blood") {
      currentStoryIndex = 0;
      currentStorySlides = bloodStory;
      renderStorySlide("blood");
    }
  }

  function renderStorySlide(type) {
    var slides = type === "blood" ? bloodStory : dentistStory;
    var slide = slides[currentStoryIndex];
    if (!slide) return;
    var prefix = type === "blood" ? "story-blood" : "story";
    var textEl = document.getElementById(prefix + "-text");
    var imgEl = document.getElementById(prefix + "-illustration-img");
    var illEl = document.getElementById(prefix + "-illustration");
    if (textEl) textEl.textContent = slide.text;
    if (illEl) illEl.setAttribute("aria-label", slide.text || "Иллюстрация");
    if (imgEl) {
      if (slide.image) {
        var path = slide.image.indexOf("/") === 0 ? slide.image : "/" + slide.image;
        var fullUrl = window.location.origin + path;
        imgEl.alt = slide.text || "";
        imgEl.style.display = "block";
        imgEl.onerror = function () {
          this.style.display = "none";
        };
        imgEl.onload = function () {
          this.style.display = "block";
        };
        imgEl.src = fullUrl;
      } else {
        imgEl.src = "";
        imgEl.alt = "";
        imgEl.style.display = "none";
      }
    }
    var prevBtn = document.getElementById(prefix + "-prev");
    var nextBtn = document.getElementById(prefix + "-next");
    if (prevBtn) prevBtn.disabled = currentStoryIndex === 0;
    if (nextBtn) nextBtn.disabled = currentStoryIndex === slides.length - 1;
  }

  function getActiveStoryType() {
    return document.getElementById("screen-story-blood") && document.getElementById("screen-story-blood").classList.contains("active") ? "blood" : "dentist";
  }

  function storyNext() {
    var type = getActiveStoryType();
    var slides = type === "blood" ? bloodStory : dentistStory;
    if (currentStoryIndex < slides.length - 1) {
      currentStoryIndex++;
      renderStorySlide(type);
    }
  }

  function storyPrev() {
    if (currentStoryIndex > 0) {
      currentStoryIndex--;
      renderStorySlide(getActiveStoryType());
    }
  }

  function closeWebApp() {
    if (Telegram && Telegram.close) Telegram.close();
  }

  function openBotForWrite() {
    var hint = "Вы вернётесь в чат с ботом. Напишите там ваше сообщение и нажмите Отправить. Мы ответим вам в этом же чате.";
    if (typeof Telegram !== "undefined" && Telegram.WebApp) {
      if (Telegram.WebApp.showAlert) Telegram.WebApp.showAlert(hint);
      if (Telegram.WebApp.close) Telegram.WebApp.close();
    } else {
      alert(hint);
      if (window.close) window.close();
    }
  }

  function openServiceLink() {
    // Ссылка на внешний сайт — пока нет, можно показать заглушку или ничего
    if (Telegram && Telegram.showAlert) {
      Telegram.showAlert("Ссылка на сервис будет добавлена позже.");
    } else {
      alert("Ссылка на сервис будет добавлена позже.");
    }
  }

  document.getElementById("app").addEventListener("click", function (e) {
    var target = e.target.closest("[data-screen]");
    if (target) {
      var screen = target.getAttribute("data-screen");
      if (screen) {
        e.preventDefault();
        showScreen(screen);
      }
    }

    var action = e.target.closest("[data-action]");
    if (action) {
      var act = action.getAttribute("data-action");
      if (act === "close") closeWebApp();
      if (act === "write-us") openBotForWrite();
      if (act === "service") openServiceLink();
      if (act === "story-dentist") showScreen("story-dentist");
      if (act === "story-blood") showScreen("story-blood");
    }

    var btnStart = e.target.closest(".card-direction .btn-start");
    if (btnStart) {
      var cardDir = btnStart.closest(".card-direction");
      var dir = cardDir && cardDir.getAttribute("data-direction");
      if (dir === "dentist") showScreen("dentist");
      if (dir === "blood") showScreen("blood");
    }
  });

  document.getElementById("story-prev") && document.getElementById("story-prev").addEventListener("click", storyPrev);
  document.getElementById("story-next") && document.getElementById("story-next").addEventListener("click", storyNext);
  document.getElementById("story-blood-prev") && document.getElementById("story-blood-prev").addEventListener("click", storyPrev);
  document.getElementById("story-blood-next") && document.getElementById("story-blood-next").addEventListener("click", storyNext);

  /* --- Запись к врачу --- */
  var bookingClinics = [
    { id: "1", name: "Клиника «Улыбка»", spec: "Детская стоматология", address: "Москва, ул. Ленина, 25", price: "от 2500 Р" }
  ];
  var bookingMyAppointments = [];
  var bookingTimeSlots = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00"];
  var bookingSelectedClinicId = null;
  var bookingRescheduleId = null;
  var bookingCancelId = null;

  function getBookingTabsView() { return document.getElementById("booking-tabs-view"); }
  function getBookingFormView() { return document.getElementById("booking-form-view"); }
  function getBookingCancelModal() { return document.getElementById("booking-cancel-modal"); }

  function showBookingTabsView() {
    getBookingTabsView().classList.remove("hidden");
    getBookingFormView().classList.add("hidden");
    bookingRescheduleId = null;
    bookingSelectedClinicId = null;
    renderBookingLists();
  }

  function showBookingFormView(isReschedule) {
    getBookingTabsView().classList.add("hidden");
    getBookingFormView().classList.remove("hidden");
    var titleEl = document.getElementById("booking-form-title");
    var descEl = document.getElementById("booking-form-desc");
    var noteEl = document.getElementById("booking-form-note");
    var submitBtn = document.getElementById("btn-booking-submit");
    var dateVal = "";
    var selectedSlot = "";
    if (isReschedule && bookingRescheduleId) {
      var apt = bookingMyAppointments.find(function (a) { return a.id === bookingRescheduleId; });
      if (apt) { dateVal = dateToInputValue(apt.date); selectedSlot = apt.time; }
    }
    if (isReschedule) {
      titleEl.textContent = "Перенос записи";
      descEl.textContent = "Выберите желаемую дату и время записи";
      noteEl.textContent = "Администратор клиники свяжется с вами для уточнения и согласования даты и времени записи";
      submitBtn.textContent = "Перенести";
    } else {
      titleEl.textContent = "Запись в клинику";
      descEl.textContent = "Выберите желаемую дату и время записи";
      noteEl.textContent = "Администратор клиники свяжется с вами для уточнения даты и времени записи";
      submitBtn.textContent = "Отправить заявку";
    }
    var dateInput = document.getElementById("booking-date");
    dateInput.value = dateVal;
    dateInput.setAttribute("min", todayMin());
    document.getElementById("booking-phone").value = "";
    var container = document.getElementById("booking-time-slots");
    container.innerHTML = "";
    bookingTimeSlots.forEach(function (slot) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "booking-time-slot" + (slot === selectedSlot ? " active" : "");
      btn.textContent = slot;
      btn.dataset.slot = slot;
      btn.addEventListener("click", function () {
        container.querySelectorAll(".booking-time-slot").forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
      });
      container.appendChild(btn);
    });
  }

  function renderBookingLists() {
    var myCount = document.getElementById("booking-my-count");
    var clinicsCount = document.getElementById("booking-clinics-count");
    var myList = document.getElementById("booking-my-list");
    var myEmpty = document.getElementById("booking-my-empty");
    var clinicsList = document.getElementById("booking-clinics-list");

    myCount.textContent = bookingMyAppointments.length;
    clinicsCount.textContent = bookingClinics.length;

    myEmpty.style.display = bookingMyAppointments.length === 0 ? "block" : "none";
    myList.innerHTML = "";
    bookingMyAppointments.forEach(function (apt) {
      var card = document.createElement("div");
      card.className = "booking-card";
      card.innerHTML =
        "<div class=\"booking-card-title\">" + escapeHtml(apt.clinicName) + "</div>" +
        "<div class=\"booking-card-meta\"><span class=\"booking-card-meta-icon booking-icon booking-icon-calendar\" aria-hidden=\"true\"></span>" + escapeHtml(formatDateDisplay(apt.date)) + "</div>" +
        "<div class=\"booking-card-meta\"><span class=\"booking-card-meta-icon booking-icon booking-icon-clock\" aria-hidden=\"true\"></span>" + escapeHtml(apt.time) + "</div>" +
        "<div class=\"booking-card-meta\"><span class=\"booking-card-meta-icon booking-icon booking-icon-geo\" aria-hidden=\"true\"></span>" + escapeHtml(apt.address) + "</div>" +
        "<div class=\"booking-card-meta\"><span class=\"booking-card-meta-icon booking-icon booking-icon-people\" aria-hidden=\"true\"></span>" + escapeHtml(apt.doctor) + "</div>" +
        "<div class=\"booking-card-actions\">" +
        "<button type=\"button\" class=\"booking-card-btn booking-card-btn-reschedule\" data-booking-reschedule=\"" + escapeHtml(apt.id) + "\">→ Перенести</button>" +
        "<button type=\"button\" class=\"booking-card-btn booking-card-btn-cancel\" data-booking-cancel=\"" + escapeHtml(apt.id) + "\">✕ Отменить</button>" +
        "</div>";
      myList.appendChild(card);
    });

    clinicsList.innerHTML = "";
    bookingClinics.forEach(function (cl) {
      var card = document.createElement("div");
      card.className = "booking-clinic-card";
      card.innerHTML =
        "<div class=\"booking-clinic-card-title\">" + escapeHtml(cl.name) + "</div>" +
        "<div class=\"booking-clinic-card-spec\">" + escapeHtml(cl.spec) + "</div>" +
        "<div class=\"booking-clinic-card-address\"><span class=\"booking-clinic-card-address-icon booking-icon booking-icon-geo\" aria-hidden=\"true\"></span>" + escapeHtml(cl.address) + "</div>" +
        "<div class=\"booking-clinic-card-footer\">" +
        "<div class=\"booking-clinic-price\">Стоимость <span class=\"booking-clinic-price-value\">" + escapeHtml(cl.price) + "</span></div>" +
        "<button type=\"button\" class=\"booking-clinic-btn\" data-booking-clinic=\"" + escapeHtml(cl.id) + "\">Записаться &gt;</button>" +
        "</div>";
      clinicsList.appendChild(card);
    });
  }

  function escapeHtml(s) {
    if (!s) return "";
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  /** Преобразует дату в формат для input[type=date] (yyyy-mm-dd) или возвращает пустую строку. */
  function dateToInputValue(str) {
    if (!str) return "";
    var match = str.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (match) return match[3] + "-" + match[2].padStart(2, "0") + "-" + match[1].padStart(2, "0");
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
    return "";
  }

  /** Форматирует дату для отображения (dd.mm.yyyy). */
  function formatDateDisplay(str) {
    if (!str) return "";
    var match = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return match[3] + "." + match[2] + "." + match[1];
    return str;
  }

  /** Сегодня в формате yyyy-mm-dd для атрибута min. */
  function todayMin() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function onBookingBackClick(e) {
    var target = e.target.closest(".btn-booking-back");
    if (!target) return;
    if (document.getElementById("screen-booking").classList.contains("active") && !getBookingFormView().classList.contains("hidden")) {
      e.preventDefault();
      e.stopPropagation();
      showBookingTabsView();
      return;
    }
  }

  document.getElementById("app").addEventListener("click", function (e) {
    onBookingBackClick(e);
  }, true);

  document.querySelectorAll(".booking-tab").forEach(function (tab) {
    tab.addEventListener("click", function () {
      document.querySelectorAll(".booking-tab").forEach(function (t) { t.classList.remove("active"); });
      document.querySelectorAll(".booking-tab-panel").forEach(function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      var tabName = tab.getAttribute("data-tab");
      if (tabName === "my") document.getElementById("booking-tab-my").classList.add("active");
      else document.getElementById("booking-tab-clinics").classList.add("active");
    });
  });

  document.getElementById("btn-booking-new").addEventListener("click", function () {
    bookingSelectedClinicId = bookingClinics[0] ? bookingClinics[0].id : null;
    showBookingFormView(false);
  });
  document.getElementById("btn-booking-from-clinics").addEventListener("click", function () {
    bookingSelectedClinicId = bookingClinics[0] ? bookingClinics[0].id : null;
    showBookingFormView(false);
  });

  document.getElementById("booking-clinics-list").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-booking-clinic]");
    if (btn) {
      bookingSelectedClinicId = btn.getAttribute("data-booking-clinic");
      showBookingFormView(false);
    }
  });

  document.getElementById("booking-my-list").addEventListener("click", function (e) {
    var rescheduleBtn = e.target.closest("[data-booking-reschedule]");
    var cancelBtn = e.target.closest("[data-booking-cancel]");
    if (rescheduleBtn) {
      bookingRescheduleId = rescheduleBtn.getAttribute("data-booking-reschedule");
      showBookingFormView(true);
    }
    if (cancelBtn) {
      bookingCancelId = cancelBtn.getAttribute("data-booking-cancel");
      getBookingCancelModal().classList.remove("hidden");
    }
  });

  document.getElementById("btn-booking-submit").addEventListener("click", function () {
    var date = document.getElementById("booking-date").value.trim();
    var phone = document.getElementById("booking-phone").value.trim();
    var slotBtn = document.querySelector("#booking-time-slots .booking-time-slot.active");
    var time = slotBtn ? slotBtn.dataset.slot : "";
    if (!date || !time) {
      if (Telegram && Telegram.WebApp && Telegram.WebApp.showAlert) Telegram.WebApp.showAlert("Укажите дату и время.");
      else alert("Укажите дату и время.");
      return;
    }
    var clinic = bookingClinics.find(function (c) { return c.id === (bookingSelectedClinicId || (bookingClinics[0] && bookingClinics[0].id)); }) || bookingClinics[0];
    if (!clinic) return;
    if (bookingRescheduleId) {
      var idx = bookingMyAppointments.findIndex(function (a) { return a.id === bookingRescheduleId; });
      if (idx !== -1) {
        bookingMyAppointments[idx] = {
          id: bookingMyAppointments[idx].id,
          clinicId: clinic.id,
          clinicName: clinic.name,
          address: clinic.address,
          date: date,
          time: time,
          doctor: "Врач Иванова А.С."
        };
      }
      if (Telegram && Telegram.WebApp && Telegram.WebApp.showAlert) Telegram.WebApp.showAlert("Запись перенесена. Администратор свяжется с вами.");
      else alert("Запись перенесена. Администратор свяжется с вами.");
    } else {
      var newId = "apt-" + Date.now();
      bookingMyAppointments.push({
        id: newId,
        clinicId: clinic.id,
        clinicName: clinic.name,
        address: clinic.address,
        date: date,
        time: time,
        doctor: "Врач Иванова А.С."
      });
      if (Telegram && Telegram.WebApp && Telegram.WebApp.showAlert) Telegram.WebApp.showAlert("Заявка отправлена. Администратор свяжется с вами для уточнения.");
      else alert("Заявка отправлена. Администратор свяжется с вами для уточнения.");
    }
    showBookingTabsView();
  });

  document.querySelector(".btn-booking-cancel-no").addEventListener("click", function () {
    getBookingCancelModal().classList.add("hidden");
    bookingCancelId = null;
  });
  document.querySelector(".btn-booking-cancel-yes").addEventListener("click", function () {
    if (bookingCancelId) {
      bookingMyAppointments = bookingMyAppointments.filter(function (a) { return a.id !== bookingCancelId; });
      bookingCancelId = null;
    }
    getBookingCancelModal().classList.add("hidden");
    renderBookingLists();
    if (Telegram && Telegram.WebApp && Telegram.WebApp.showAlert) Telegram.WebApp.showAlert("Запись отменена.");
    else alert("Запись отменена.");
  });
  getBookingCancelModal().querySelector(".booking-modal-backdrop").addEventListener("click", function () {
    getBookingCancelModal().classList.add("hidden");
    bookingCancelId = null;
  });

  function initBookingScreen() {
    showBookingTabsView();
  }

  var origShowScreen = showScreen;
  showScreen = function (screenId) {
    origShowScreen(screenId);
    if (screenId === "booking") initBookingScreen();
  };

  showScreen("welcome");
})();
