/* temhamain1-N1 */
(function() {
  $(function() {
    $(".temhamain1-N1[id=\'XYmk1ALhP3\']").each(function() {
      const $block = $(this);
      let isMobileMenuInitialized = false;
      let isDesktopMenuInitialized = false;
      // 모바일 메뉴 초기화
      function initMobileMenu() {
        if (isMobileMenuInitialized) return;
        const $btnMomenu = $block.find(".btn-momenu");
        $btnMomenu.off("click").on("click", function() {
          $block.toggleClass("block-active");
          $block.find(".header-gnbitem").removeClass("item-active");
          $block.find(".header-sublist").removeAttr("style");
        });
        $block.find(".header-gnbitem").each(function() {
          const $this = $(this);
          const $thisLink = $this.find(".header-gnblink");
          const $sublist = $this.find(".header-sublist");
          if ($sublist.length) {
            $thisLink.off("click").on("click", function(event) {
              event.preventDefault();
              const $clickedItem = $(this).closest(".header-gnbitem");
              if (!$clickedItem.hasClass("item-active")) {
                $block.find(".header-gnbitem").removeClass("item-active");
                $block.find(".header-sublist").stop().slideUp(300);
              }
              $clickedItem.toggleClass("item-active");
              $sublist.stop().slideToggle(300);
            });
          }
        });
        isMobileMenuInitialized = true;
      }
      // 데스크탑 메뉴 초기화
      function initDesktopMenu() {
        if (isDesktopMenuInitialized) return;
        $block.find(".header-gnbitem .header-gnblink").off("click");
        isDesktopMenuInitialized = true;
      }
      // GNB Hover
      function initGnbHover() {
        let maxSubH = 0;
        $block.find(".header-sublist").each(function() {
          $(this).css("display", "block");
          maxSubH = Math.max(maxSubH, $(this).outerHeight());
          $(this).css("display", "");
        });
        $block.find(".header-sublist").css("min-height", `${maxSubH}px`);
        $block
          .find(".header-gnb")
          .off("mouseenter.gnb mouseleave.gnb")
          .on("mouseenter.gnb", function() {
            if (window.innerWidth <= 992) return;
            const headerH = $block.find(".header-container").outerHeight();
            $block.css("min-height", `${headerH + maxSubH + 20}px`);
          })
          .on("mouseleave.gnb", function() {
            if (window.innerWidth <= 992) return;
            $block.css("min-height", "");
          });
      }
      // Observer 등록
      const gnbNode = $block.find(".header-gnb").get(0);
      if (gnbNode) {
        const observer = new MutationObserver(() => {
          initGnbHover();
        });
        observer.observe(gnbNode, {
          childList: true,
          subtree: true,
        });
      }
      // 해상도에 따른 메뉴 처리
      function handleResize() {
        if (window.innerWidth <= 992) {
          if (!isMobileMenuInitialized) initMobileMenu();
          isDesktopMenuInitialized = false;
        } else {
          if (!isDesktopMenuInitialized) initDesktopMenu();
          isMobileMenuInitialized = false;
          initGnbHover(); // 데스크탑일 때 hover 로직 초기화
        }
      }
      // 스크롤 시 메뉴 처리
      function handleScroll() {
        const $headerTop = $block.find(".header-top");
        if ($headerTop.length) $block.addClass("top-menu-active");
        if ($(window).scrollTop() === 0) $block.addClass("header-top-active");
        $(window).on("scroll", function() {
          if ($(window).scrollTop() > 0) {
            $block.removeClass("header-top-active");
          } else {
            $block.addClass("header-top-active");
          }
        });
      }
      handleScroll();
      // 전체 메뉴 열기/닫기 처리
      function handleFullMenu() {
        $block.find(".btn-allmenu").on("click", function() {
          $block.find(".header-fullmenu").addClass("fullmenu-active");
        });
        $block.find(".fullmenu-close").on("click", function() {
          $block.find(".header-fullmenu").removeClass("fullmenu-active");
        });
        $block.find(".fullmenu-gnbitem").each(function() {
          const $this = $(this);
          $this.on("mouseover", function() {
            if (window.innerWidth > 992) {
              $this.find(".fullmenu-gnblink").addClass("on");
            }
          });
          $this.on("mouseout", function() {
            if (window.innerWidth > 992) {
              $this.find(".fullmenu-gnblink").removeClass("on");
            }
          });
        });
      }
      handleFullMenu();
      // 리사이즈 시마다 메뉴 동작 초기화
      $(window).on("resize", handleResize);
      handleResize();
    });
  });
})();
/* temhamain1-N3 */
(function() {
  $(function() {
    $(".temhamain1-N3[id=\'QPMk1AlhV7\']").each(function() {
      const $block = $(this);
      visualSlider();

      function visualSlider() {
        // Slide Title
        $block
          .find(".visual-slider .visual-pagination > li")
          .promise()
          .done(function() {
            // Slide Page Number
            var num = $block.find(".visual-slider .num");
            var slides = $block.find(".visual-slider .swiper-slide");
            var slideCount = slides.length;
            num.html(`<strong>1</strong> / ${slideCount}`);

            // Swiper
            var visualSwiper = new Swiper(".temhamain1-N3[id=\'QPMk1AlhV7\'] .visual-slider", {
              loop: true,
              slidesPerView: "auto",
              autoplay: {
                delay: 5000,
                disableOnInteraction: false,
              },
              pagination: {
                el: ".temhamain1-N3[id=\'QPMk1AlhV7\'] .visual-slider .visual-pagination",
                clickable: "true",
                type: "bullets",
                renderBullet: (index, className) => {
                  return `<li class="${className}"><span class="bar"></span><span class="number">${String(
                    index + 1
                  ).padStart(2, "0")}</span></li>`;
                },
              },
            });
          });
      }
    });
  });
})();
/* temhamain1-N6 */
(function() {
  $(function() {
    $(".temhamain1-N6[id=\'NXmk1aLid1\']").each(function() {
      const $block = $(this);
      // Swiper
      const aboutSwiper = new Swiper(".temhamain1-N6[id=\'NXmk1aLid1\'] .contents-slide", {
        speed: 600,
        parallax: true,
        loop: true,
        touchEventsTarget: "wrapper",
        slidesPerView: "auto",
        navigation: {
          nextEl: ".temhamain1-N6[id=\'NXmk1aLid1\'] .contents-control .button-next",
          prevEl: ".temhamain1-N6[id=\'NXmk1aLid1\'] .contents-control .button-prev",
        },
        pagination: {
          el: ".temhamain1-N6[id=\'NXmk1aLid1\'] .contents-control .pagination_fraction",
          type: "fraction",
          formatFractionCurrent: function(number) {
            return ("0" + number).slice(-2);
          },
          formatFractionTotal: function(number) {
            return ("0" + number).slice(-2);
          },
          renderFraction: function(currentClass, totalClass) {
            return (
              '<span class="' +
              currentClass +
              '"></span>' +
              "/" +
              '<span class="' +
              totalClass +
              '"></span>'
            );
          },
        }
      });
    });
  });
})();
