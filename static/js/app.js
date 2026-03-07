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

  var dentistStory = [
    { text: "Я иду в стоматологию, чтобы врач проверил мои зубки.", image: "images/story-dentist/dentist-slide-01.png" },
    { text: "Когда я приду в стоматологию, я надену бахилы.", image: "images/story-dentist/dentist-slide-02.jpeg" },
    { text: "Потом я сдам куртку в гардероб.", image: "images/story-dentist/dentist-slide-03.png" },
    { text: "Я пойду с мамой в регистратуру, чтобы врач узнал, что я пришел.", image: "images/story-dentist/dentist-slide-04.jpeg" },
    { text: "После этого, я буду сидеть спокойно и ждать своей очереди. В холле может быть шумно.", image: "images/story-dentist/dentist-slide-05.jpeg" },
    { text: "Когда меня позовут, я зайду в кабинет", image: "images/story-dentist/dentist-slide-06.jpeg" },
    { text: "Там меня встретит врач-стоматолог", image: "images/story-dentist/dentist-slide-07.jpeg" },
    { text: "Я поздороваюсь с врачом", image: "images/story-dentist/dentist-slide-08.jpeg" },
    { text: "Я поздороваюсь с врачом", image: "images/story-dentist/dentist-slide-09.jpeg" },
    { text: "Доктор пригласит меня сесть в кресло", image: "images/story-dentist/dentist-slide-10.jpeg" },
    { text: "Я сяду в кресло, как скажет доктор.", image: "images/story-dentist/dentist-slide-11.jpeg" },
    { text: "Кресло может двигаться вниз и вверх", image: "images/story-dentist/dentist-slide-12.jpeg" },
    { text: "Я положу голову на подголовник, а ноги ровно положу на подставку", image: "images/story-dentist/dentist-slide-13.jpeg" },
    { text: "Я буду сидеть спокойно, потому что это нестрашно", image: "images/story-dentist/dentist-slide-14.png" },
    { text: "Над креслом висит большая яркая лампа. Она нужна врачу, чтобы лучше видеть.", image: "images/story-dentist/dentist-slide-15.jpeg" },
    { text: "Врач наденет на меня салфетку.", image: "images/story-dentist/dentist-slide-16.jpeg" },
    { text: "Врач наденет перчатки", image: "images/story-dentist/dentist-slide-17.jpeg" },
    { text: "Во время приема я не буду хватать врача за руки, чтобы не мешать", image: "images/story-dentist/dentist-slide-18.jpeg" },
    { text: "Я не буду кусаться", image: "images/story-dentist/dentist-slide-19.jpeg" },
    { text: "Врач будет использовать специальные инструменты, чтобы осмотреть меня", image: "images/story-dentist/dentist-slide-20.jpeg" },
    { text: "Врач попросит меня открыть рот и я выполню его просьбу.", image: "images/story-dentist/dentist-slide-21.jpeg" },
    { text: "Доктор осмотрит мои зубки с помощью зеркала. Это не больно.", image: "images/story-dentist/dentist-slide-22.jpeg" },
    { text: "Врач может использовать специальный инструмент, чтобы полечить мои зубы. Он шумит.", image: "images/story-dentist/dentist-slide-23.jpeg" },
    { text: "Я прополощу рот и выплюну воду, когда доктор скажет.", image: "images/story-dentist/dentist-slide-24.jpeg" },
    { text: "Врач может поставить мне в рот трубку для отвода слюны и воды. Она может шуметь.", image: "images/story-dentist/dentist-slide-25.jpeg" },
    { text: "Врач польет водичкой на мои зубы чтобы они стали", image: "images/story-dentist/dentist-slide-26.jpeg" },
    { text: "Врач посушит мои зубки воздухом, чтобы они стали сухими", image: "images/story-dentist/dentist-slide-27.jpeg" },
    { text: "Осмотр окончен.", image: "images/story-dentist/dentist-slide-28.jpeg" },
    { text: "Врач расскажет мне, как ухаживать за зубками.", image: "images/story-dentist/dentist-slide-29.jpeg" },
    { text: "Я молодец! Теперь мои зубы будут здоровы.", image: "images/story-dentist/dentist-slide-30.jpeg" },
    { text: "Врач даст мне подарок!", image: null }
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
        imgEl.src = slide.image;
        imgEl.alt = slide.text || "";
        imgEl.style.display = "block";
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
    if (Telegram && Telegram.close) Telegram.close();
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

  showScreen("welcome");
})();
