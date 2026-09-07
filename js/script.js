/* =========================================================
   ASIT ENTERPRISES
   Main Website JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     MOBILE MENU
  ======================================================= */

  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menu && nav) {

    menu.addEventListener("click", () => {

      const open = nav.classList.toggle("open");

      menu.classList.toggle("active", open);

      menu.setAttribute(
        "aria-expanded",
        String(open)
      );

      document.body.classList.toggle(
        "menu-open",
        open
      );

    });


    document.querySelectorAll(".nav a").forEach(link => {

      link.addEventListener("click", () => {

        nav.classList.remove("open");

        menu.classList.remove("active");

        menu.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "menu-open"
        );

      });

    });

  }


  /* =======================================================
     PROJECT FILTER
  ======================================================= */

  const buttons = document.querySelectorAll(
    ".filter button"
  );

  const cards = document.querySelectorAll(
    ".project-card"
  );


  buttons.forEach(button => {

    button.addEventListener("click", () => {

      buttons.forEach(btn => {
        btn.classList.remove("active");
      });

      button.classList.add("active");


      const filter =
        button.dataset.filter;


      cards.forEach(card => {

        const category =
          card.dataset.category;


        const show =
          filter === "all" ||
          category === filter;


        card.classList.remove(
          "filter-visible",
          "filter-hidden"
        );


        if (show) {

          card.classList.add(
            "filter-visible"
          );

          card.style.display = "";

        } else {

          card.classList.add(
            "filter-hidden"
          );

          card.style.display = "none";

        }

      });

    });

  });


  /* =======================================================
     ONGOING PROJECT PHOTO GALLERIES
  ======================================================= */

  const galleries =
    document.querySelectorAll(
      ".ongoing-gallery"
    );


  galleries.forEach(gallery => {

    const image =
      gallery.querySelector(
        ".ongoing-gallery-image"
      );


    const previousButton =
      gallery.querySelector(
        ".gallery-prev"
      );


    const nextButton =
      gallery.querySelector(
        ".gallery-next"
      );


    const dotsContainer =
      gallery.querySelector(
        ".gallery-dots"
      );


    const counter =
      gallery.querySelector(
        ".gallery-count"
      );


    if (
      !image ||
      !previousButton ||
      !nextButton ||
      !dotsContainer ||
      !counter
    ) {
      return;
    }


    let images = [];


    try {

      images =
        JSON.parse(
          gallery.dataset.images || "[]"
        );

    } catch (error) {

      console.error(
        "Gallery image list could not be loaded:",
        error
      );

      return;

    }


    if (!images.length) {
      return;
    }


    let currentIndex = 0;

    let isChanging = false;


    images.forEach((imagePath, index) => {

      const dot =
        document.createElement("button");


      dot.type = "button";

      dot.className =
        "gallery-dot";


      dot.setAttribute(
        "aria-label",
        `View project photo ${index + 1}`
      );


      dot.addEventListener(
        "click",
        () => {
          showImage(index);
        }
      );


      dotsContainer.appendChild(dot);

    });


    const dots =
      dotsContainer.querySelectorAll(
        ".gallery-dot"
      );


    function updateGalleryUI() {

      counter.textContent =
        `${currentIndex + 1} / ${images.length}`;


      dots.forEach((dot, index) => {

        dot.classList.toggle(
          "active",
          index === currentIndex
        );

      });

    }


    function showImage(index) {

      if (isChanging) {
        return;
      }


      const nextIndex =
        (index + images.length) %
        images.length;


      if (
        nextIndex === currentIndex &&
        image.getAttribute("src") ===
        images[nextIndex]
      ) {

        updateGalleryUI();

        return;

      }


      const nextImage =
        new Image();


      nextImage.onload = () => {

        isChanging = true;

        image.style.opacity = "0";


        setTimeout(() => {

          currentIndex = nextIndex;

          image.src =
            images[currentIndex];


          image.style.opacity = "1";

          updateGalleryUI();


          setTimeout(() => {

            isChanging = false;

          }, 250);

        }, 150);

      };


      nextImage.onerror = () => {

        console.warn(
          "Gallery image could not be loaded:",
          images[nextIndex]
        );

        isChanging = false;

      };


      nextImage.src =
        images[nextIndex];

    }


    previousButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        showImage(
          currentIndex - 1
        );

      }
    );


    nextButton.addEventListener(
      "click",
      event => {

        event.preventDefault();

        showImage(
          currentIndex + 1
        );

      }
    );


    gallery.setAttribute(
      "tabindex",
      "0"
    );


    gallery.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "ArrowLeft"
        ) {

          event.preventDefault();

          showImage(
            currentIndex - 1
          );

        }


        if (
          event.key === "ArrowRight"
        ) {

          event.preventDefault();

          showImage(
            currentIndex + 1
          );

        }

      }
    );


    let touchStartX = 0;

    let touchEndX = 0;


    gallery.addEventListener(
      "touchstart",
      event => {

        touchStartX =
          event.changedTouches[0].screenX;

      },
      {
        passive: true
      }
    );


    gallery.addEventListener(
      "touchend",
      event => {

        touchEndX =
          event.changedTouches[0].screenX;


        const swipeDistance =
          touchEndX - touchStartX;


        if (
          Math.abs(swipeDistance) < 45
        ) {
          return;
        }


        if (swipeDistance < 0) {

          showImage(
            currentIndex + 1
          );

        } else {

          showImage(
            currentIndex - 1
          );

        }

      },
      {
        passive: true
      }
    );


    currentIndex = 0;

    image.src =
      images[0];

    updateGalleryUI();


    images.slice(1).forEach(imagePath => {

      const preload =
        new Image();

      preload.src =
        imagePath;

    });

  });


  /* =======================================================
     CLIENT REVIEWS
     Frontend-only localStorage system
  ======================================================= */

  const reviewForm =
    document.getElementById("reviewForm");

  const reviewsList =
    document.getElementById("reviewsList");

  const ratingInput =
    document.getElementById("ratingInput");

  const ratingField =
    document.getElementById("reviewRating");

  const reviewName =
    document.getElementById("reviewName");

  const reviewProject =
    document.getElementById("reviewProject");

  const reviewMessage =
    document.getElementById("reviewMessage");

  const characterCount =
    document.getElementById(
      "reviewCharacterCount"
    );

  const reviewSuccess =
    document.getElementById(
      "reviewSuccess"
    );

  const reviewError =
    document.getElementById(
      "reviewError"
    );


  const REVIEW_STORAGE_KEY =
    "asitEnterpriseReviews";


  /* =======================================================
     ADMIN SETTINGS
  ======================================================= */

  /*
     CHANGE YOUR ADMIN PASSWORD HERE
  */

  const ADMIN_PASSWORD =
    "ASIT@2026";


  const ADMIN_SESSION_KEY =
    "asitEnterpriseAdminMode";


  let isAdmin =
    sessionStorage.getItem(
      ADMIN_SESSION_KEY
    ) === "true";


  /* =======================================================
     CREATE ADMIN BUTTON
  ======================================================= */

  function createAdminButton() {

    if (!reviewsList) {
      return;
    }


    let adminButton =
      document.getElementById(
        "adminReviewButton"
      );


    if (!adminButton) {

      adminButton =
        document.createElement("button");


      adminButton.type =
        "button";


      adminButton.id =
        "adminReviewButton";


      adminButton.className =
        "admin-review-button";


      const reviewsSection =
        reviewsList.closest(
          "section"
        );


      if (reviewsSection) {

        reviewsSection.appendChild(
          adminButton
        );

      } else {

        reviewsList.parentElement.appendChild(
          adminButton
        );

      }

    }


    updateAdminButton(
      adminButton
    );


    adminButton.addEventListener(
      "click",
      () => {

        if (isAdmin) {

          isAdmin = false;

          sessionStorage.removeItem(
            ADMIN_SESSION_KEY
          );


          updateAdminButton(
            adminButton
          );


          renderReviews();


          return;

        }


        const password =
          window.prompt(
            "Enter the admin password:"
          );


        if (
          password ===
          ADMIN_PASSWORD
        ) {

          isAdmin = true;


          sessionStorage.setItem(
            ADMIN_SESSION_KEY,
            "true"
          );


          updateAdminButton(
            adminButton
          );


          renderReviews();


          alert(
            "Admin mode activated."
          );

        } else if (
          password !== null
        ) {

          alert(
            "Incorrect admin password."
          );

        }

      }
    );

  }


  /* =======================================================
     UPDATE ADMIN BUTTON
  ======================================================= */

  function updateAdminButton(
    button
  ) {

    if (!button) {
      return;
    }


    if (isAdmin) {

      button.textContent =
        "Exit Admin Mode";


      button.setAttribute(
        "aria-label",
        "Exit review admin mode"
      );


      button.classList.add(
        "admin-active"
      );

    } else {

      button.textContent =
        "Admin";


      button.setAttribute(
        "aria-label",
        "Open review admin mode"
      );


      button.classList.remove(
        "admin-active"
      );

    }

  }


  /* =======================================================
     ESCAPE USER CONTENT
  ======================================================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =======================================================
     READ REVIEWS
  ======================================================= */

  function getSavedReviews() {

    try {

      const saved =
        localStorage.getItem(
          REVIEW_STORAGE_KEY
        );


      if (!saved) {
        return [];
      }


      const parsed =
        JSON.parse(saved);


      if (!Array.isArray(parsed)) {
        return [];
      }


      return parsed;

    } catch (error) {

      console.error(
        "Reviews could not be loaded:",
        error
      );

      return [];

    }

  }


  /* =======================================================
     SAVE REVIEWS
  ======================================================= */

  function saveReviews(reviews) {

    try {

      localStorage.setItem(
        REVIEW_STORAGE_KEY,
        JSON.stringify(reviews)
      );

      return true;

    } catch (error) {

      console.error(
        "Reviews could not be saved:",
        error
      );

      return false;

    }

  }


  /* =======================================================
     CREATE STAR DISPLAY
  ======================================================= */

  function createStars(rating) {

    const safeRating =
      Math.max(
        1,
        Math.min(
          5,
          Number(rating) || 0
        )
      );


    return (
      "★".repeat(safeRating) +
      "☆".repeat(5 - safeRating)
    );

  }


  /* =======================================================
     DELETE REVIEW
  ======================================================= */

  function deleteReview(reviewId) {

    /*
       Extra security check.
       Only Admin Mode can delete reviews.
    */

    if (!isAdmin) {

      alert(
        "Admin access is required to delete reviews."
      );

      return;

    }


    /*
       Confirm before deleting.
    */

    const confirmed =
      window.confirm(
        "Are you sure you want to permanently delete this review?"
      );


    if (!confirmed) {
      return;
    }


    /*
       Get existing reviews.
    */

    const reviews =
      getSavedReviews();


    /*
       Find the review.
    */

    const reviewExists =
      reviews.some(
        review =>
          String(review.id) ===
          String(reviewId)
      );


    if (!reviewExists) {

      alert(
        "This review could not be found."
      );

      return;

    }


    /*
       Remove the selected review.
    */

    const updatedReviews =
      reviews.filter(
        review =>
          String(review.id) !==
          String(reviewId)
      );


    /*
       Save updated review list.
    */

    const saved =
      saveReviews(
        updatedReviews
      );


    if (!saved) {

      alert(
        "The review could not be deleted. Please try again."
      );

      return;

    }


    /*
       Refresh review section.
    */

    renderReviews();


    /*
       Show confirmation.
    */

    alert(
      "Review deleted successfully."
    );

  }


  /* =======================================================
     RENDER REVIEWS
  ======================================================= */

  function renderReviews() {

    if (!reviewsList) {
      return;
    }


    const reviews =
      getSavedReviews();


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    if (!reviews.length) {

      reviewsList.innerHTML = `
        <div class="no-reviews">

          <span>★</span>

          <h3>
            Be the first to share.
          </h3>

          <p>
            Client reviews submitted through
            this page will appear here.
          </p>

        </div>
      `;

      return;

    }


    /* =====================================================
       NEWEST REVIEWS FIRST
    ===================================================== */

    reviews.sort(
      (a, b) =>
        Number(b.id) - Number(a.id)
    );


    reviewsList.innerHTML =
      reviews.map(
        (review, index) => {

          const name =
            escapeHTML(
              review.name || "Client"
            );


          const project =
            escapeHTML(
              review.project || "Project"
            );


          const message =
            escapeHTML(
              review.message || ""
            );


          const rating =
            Math.max(
              1,
              Math.min(
                5,
                Number(review.rating) || 5
              )
            );


          /* =================================================
             DATE
          ================================================= */

          let dateText =
            "Client Review";


          if (review.date) {

            const date =
              new Date(
                review.date
              );


            if (
              !Number.isNaN(
                date.getTime()
              )
            ) {

              dateText =
                date.toLocaleDateString(
                  "en-IN",
                  {
                    month: "short",
                    year: "numeric"
                  }
                );

            }

          }


          /* =================================================
             AVATAR
          ================================================= */

          const firstLetter =
            escapeHTML(
              name.charAt(0).toUpperCase()
            );


          /* =================================================
             ADMIN DELETE BUTTON
          ================================================= */

          const deleteButton =
            isAdmin
              ? `
                <button
                  type="button"
                  class="review-delete-button"
                  data-review-id="${escapeHTML(review.id)}"
                  aria-label="Delete review from ${name}"
                >
                  Delete Review
                </button>
              `
              : "";


          /* =================================================
             REVIEW CARD
          ================================================= */

          return `
            <article
              class="review-card user-review"
              data-review-id="${escapeHTML(review.id)}"
            >

              <div class="review-top">

                <div
                  class="stars"
                  aria-label="${rating} out of 5 stars"
                >
                  ${createStars(rating)}
                </div>

                <span>
                  ${String(
                    index + 1
                  ).padStart(2, "0")}
                </span>

              </div>


              <blockquote>
                “${message}”
              </blockquote>


              <div class="review-author">

                <div class="review-avatar">
                  ${firstLetter}
                </div>

                <div>

                  <strong>
                    ${name}
                  </strong>

                  <small>
                    ${project} • ${dateText}
                  </small>

                </div>

              </div>


              ${deleteButton}

            </article>
          `;

        }
      ).join("");


    /* =====================================================
       ATTACH DELETE EVENTS
    ===================================================== */

    if (isAdmin) {

      reviewsList
        .querySelectorAll(
          ".review-delete-button"
        )
        .forEach(button => {

          button.addEventListener(
            "click",
            event => {

              event.preventDefault();

              const reviewId =
                button.getAttribute(
                  "data-review-id"
                );


              if (!reviewId) {
                return;
              }


              deleteReview(
                reviewId
              );

            }
          );

        });

    }

  }


  /* =======================================================
     RATING BUTTONS
  ======================================================= */

  if (
    ratingInput &&
    ratingField
  ) {

    const ratingButtons =
      ratingInput.querySelectorAll(
        ".rating-star"
      );


    function setRating(value) {

      const rating =
        Number(value);


      ratingField.value =
        rating;


      ratingButtons.forEach(
        (button, index) => {

          const active =
            index < rating;


          button.classList.toggle(
            "active",
            active
          );


          button.setAttribute(
            "aria-checked",
            String(
              index + 1 === rating
            )
          );

        }
      );

    }


    ratingButtons.forEach(
      button => {

        button.setAttribute(
          "role",
          "radio"
        );


        button.setAttribute(
          "aria-checked",
          "false"
        );


        button.addEventListener(
          "click",
          () => {

            setRating(
              button.dataset.rating
            );

          }
        );

      }
    );

  }


  /* =======================================================
     CHARACTER COUNTER
  ======================================================= */

  if (
    reviewMessage &&
    characterCount
  ) {

    const updateCharacterCount =
      () => {

        characterCount.textContent =
          reviewMessage.value.length;

      };


    reviewMessage.addEventListener(
      "input",
      updateCharacterCount
    );


    updateCharacterCount();

  }


  /* =======================================================
     REVIEW ERROR MESSAGE
  ======================================================= */

  function showReviewError(message) {

    if (!reviewError) {
      return;
    }


    reviewError.textContent =
      message;


    reviewError.classList.add(
      "show"
    );


    if (reviewSuccess) {

      reviewSuccess.classList.remove(
        "show"
      );

    }

  }


  /* =======================================================
     REVIEW SUCCESS MESSAGE
  ======================================================= */

  function showReviewSuccess() {

    if (!reviewSuccess) {
      return;
    }


    reviewSuccess.classList.add(
      "show"
    );


    if (reviewError) {

      reviewError.classList.remove(
        "show"
      );

      reviewError.textContent = "";

    }


    setTimeout(() => {

      reviewSuccess.classList.remove(
        "show"
      );

    }, 5000);

  }


  /* =======================================================
     REVIEW FORM SUBMISSION
  ======================================================= */

  if (reviewForm) {

    reviewForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        /* Clear previous messages */

        if (reviewError) {

          reviewError.classList.remove(
            "show"
          );

          reviewError.textContent = "";

        }


        if (reviewSuccess) {

          reviewSuccess.classList.remove(
            "show"
          );

        }


        /* =================================================
           GET FORM VALUES
        ================================================= */

        const name =
          reviewName
            ? reviewName.value.trim()
            : "";


        const project =
          reviewProject
            ? reviewProject.value.trim()
            : "";


        const message =
          reviewMessage
            ? reviewMessage.value.trim()
            : "";


        const rating =
          ratingField
            ? Number(
                ratingField.value
              )
            : 0;


        /* =================================================
           VALIDATION
        ================================================= */

        if (
          name.length < 2
        ) {

          showReviewError(
            "Please enter your name."
          );


          if (reviewName) {
            reviewName.focus();
          }


          return;

        }


        if (
          name.length > 60
        ) {

          showReviewError(
            "Your name must be 60 characters or less."
          );


          if (reviewName) {
            reviewName.focus();
          }


          return;

        }


        if (!project) {

          showReviewError(
            "Please select your project type."
          );


          if (reviewProject) {
            reviewProject.focus();
          }


          return;

        }


        if (
          rating < 1 ||
          rating > 5
        ) {

          showReviewError(
            "Please select a rating from 1 to 5 stars."
          );


          if (ratingInput) {
            ratingInput.focus();
          }


          return;

        }


        if (
          message.length < 15
        ) {

          showReviewError(
            "Please write at least 15 characters for your review."
          );


          if (reviewMessage) {
            reviewMessage.focus();
          }


          return;

        }


        if (
          message.length > 500
        ) {

          showReviewError(
            "Your review must be 500 characters or less."
          );


          if (reviewMessage) {
            reviewMessage.focus();
          }


          return;

        }


        /* =================================================
           CREATE REVIEW
        ================================================= */

        const newReview = {

          id:
            Date.now(),

          name:
            name,

          project:
            project,

          rating:
            rating,

          message:
            message,

          date:
            new Date().toISOString()

        };


        const reviews =
          getSavedReviews();


        reviews.push(
          newReview
        );


        const saved =
          saveReviews(
            reviews
          );


        if (!saved) {

          showReviewError(
            "Your review could not be saved. Please check your browser storage settings and try again."
          );


          return;

        }


        /* =================================================
           REFRESH REVIEW SECTION
        ================================================= */

        renderReviews();


        /* =================================================
           RESET FORM
        ================================================= */

        reviewForm.reset();


        if (ratingField) {

          ratingField.value = "";

        }


        if (ratingInput) {

          ratingInput
            .querySelectorAll(
              ".rating-star"
            )
            .forEach(button => {

              button.classList.remove(
                "active"
              );

              button.setAttribute(
                "aria-checked",
                "false"
              );

            });

        }


        if (characterCount) {

          characterCount.textContent =
            "0";

        }


        /* =================================================
           SHOW SUCCESS
        ================================================= */

        showReviewSuccess();


        /* =================================================
           KEEP REVIEW SECTION VISIBLE
        ================================================= */

        if (reviewsList) {

          setTimeout(() => {

            reviewsList.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });

          }, 150);

        }

      }
    );

  }


  /* =======================================================
     INITIALIZE REVIEWS
  ======================================================= */

  if (reviewsList) {

    renderReviews();

    createAdminButton();

  }


  /* =======================================================
     SCROLL REVEAL
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".section-heading, " +
      ".intro-grid, " +
      ".service-grid, " +
      ".project-grid, " +
      ".ongoing-heading, " +
      ".ongoing-grid, " +
      ".feature-copy, " +
      ".reviews-heading, " +
      ".reviews-layout, " +
      ".process-grid, " +
      ".contact-grid"
    );


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              entry.target.classList.add(
                "visible"
              );


              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(element => {

      element.classList.add(
        "reveal"
      );


      observer.observe(
        element
      );

    });

  } else {

    revealElements.forEach(element => {

      element.classList.add(
        "visible"
      );

    });

  }


  /* =======================================================
     HERO REVEAL
  ======================================================= */

  const heroContent =
    document.querySelector(
      ".hero-content"
    );


  if (heroContent) {

    requestAnimationFrame(() => {

      setTimeout(() => {

        heroContent.classList.add(
          "visible"
        );

      }, 150);

    });

  }


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  const backToTop =
    document.querySelector(
      ".back-to-top"
    );


  if (backToTop) {

    const updateBackToTop =
      () => {

        if (
          window.scrollY > 650
        ) {

          backToTop.classList.add(
            "visible"
          );

        } else {

          backToTop.classList.remove(
            "visible"
          );

        }

      };


    window.addEventListener(
      "scroll",
      updateBackToTop,
      {
        passive: true
      }
    );


    backToTop.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );


    updateBackToTop();

  }


  /* =======================================================
     CURRENT YEAR
  ======================================================= */

  const year =
    document.getElementById(
      "year"
    );


  if (year) {

    year.textContent =
      new Date().getFullYear();

  }


  /* =======================================================
     IMAGE ERROR HANDLING
  ======================================================= */

  document
    .querySelectorAll("img")
    .forEach(image => {

      image.addEventListener(
        "error",
        () => {

          image.classList.add(
            "image-error"
          );

        }
      );

    });


  /* =======================================================
     ACTIVE NAVIGATION ON SCROLL
  ======================================================= */

  const sections =
    document.querySelectorAll(
      "main section[id]"
    );


  const navLinks =
    document.querySelectorAll(
      '.nav a[href^="#"]'
    );


  if (
    sections.length &&
    navLinks.length &&
    "IntersectionObserver" in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            const id =
              entry.target.getAttribute(
                "id"
              );


            navLinks.forEach(link => {

              link.classList.remove(
                "current"
              );


              if (
                link.getAttribute(
                  "href"
                ) ===
                `#${id}`
              ) {

                link.classList.add(
                  "current"
                );

              }

            });

          });

        },
        {
          rootMargin:
            "-30% 0px -60% 0px"
        }
      );


    sections.forEach(section => {

      sectionObserver.observe(
        section
      );

    });

  }

});