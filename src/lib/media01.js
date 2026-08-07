export function media01(scope = document) {
  const roots = scope.matches?.("[data-media-01-player]")
    ? [scope]
    : [...scope.querySelectorAll("[data-media-01-player]")];
  const cleanups = media01.cleanups || (media01.cleanups = new WeakMap());
  const triggerScope = scope === document ? document : scope.ownerDocument || document;

  roots.forEach((root, rootIndex) => {
    cleanups.get(root)?.();

    const playerId = root.getAttribute("data-media-01-player") || "";
    const openButtons = [...triggerScope.querySelectorAll("[data-media-01-open]")].filter(
      (button) => button.getAttribute("data-media-01-open") === playerId
    );
    const modal = root.matches("[data-media-modal]")
      ? root
      : root.querySelector("[data-media-modal]");
    const shell = root.querySelector("[data-media-shell]");
    const stage = root.querySelector("[data-media-stage]");
    const video = root.querySelector("[data-media-video]");
    const previewVideo = root.querySelector("[data-media-preview-video]");
    const playButton = root.querySelector("[data-media-play]");
    const muteButton = root.querySelector("[data-media-mute]");
    const volumeInput = root.querySelector("[data-media-volume]");
    const speedRoot = root.querySelector("[data-media-speed]");
    const speedButton = root.querySelector("[data-media-speed-toggle]");
    const speedMenu = root.querySelector("[data-media-speed-menu]");
    const speedLabel = root.querySelector("[data-media-speed-label]");
    const speedOptions = [...root.querySelectorAll("[data-media-speed-option]")];
    const pipButton = root.querySelector("[data-media-pip]");
    const fullscreenButton = root.querySelector("[data-media-fullscreen]");
    const centerButton = root.querySelector("[data-media-center-toggle]");
    const currentTimeNode = root.querySelector("[data-media-current]");
    const durationNode = root.querySelector("[data-media-duration]");
    const timeline = root.querySelector("[data-media-timeline]");
    const chapterTrack = root.querySelector("[data-media-chapter-track]");
    const scrubber = root.querySelector("[data-media-scrubber]");
    const previewCard = root.querySelector("[data-media-preview-card]");
    const previewTimeNode = root.querySelector("[data-media-preview-time]");
    const previewTitleNode = root.querySelector("[data-media-preview-title]");
    const closeButtons = [...root.querySelectorAll("[data-media-close]")];
    const playPath = root.querySelector("[data-media-play-path]");
    const roundFilter = root.querySelector("[data-media-round-filter]");
    const pulse = root.querySelector("[data-media-pulse]");

    if (
      !modal ||
      !shell ||
      !stage ||
      !video ||
      !previewVideo ||
      !playButton ||
      !muteButton ||
      !volumeInput ||
      !speedRoot ||
      !speedButton ||
      !speedMenu ||
      !speedLabel ||
      !speedOptions.length ||
      !pipButton ||
      !fullscreenButton ||
      !centerButton ||
      !timeline ||
      !chapterTrack ||
      !scrubber ||
      !pulse
    ) {
      return;
    }

    const controller = new AbortController();
    const { signal } = controller;
    let activeBeforeOpen = null;
    let closeTimer = 0;
    let closeRevealTimer = 0;
    let chromeTimer = 0;
    let previewFrame = 0;
    let isPointerOverStage = false;
    let isDragging = false;
    let activePointerId = null;
    let pendingScrubTime = null;
    let resumeAfterScrub = false;
    let lastPointerWasTouch = false;
    let touchStageHadChrome = false;
    let lastCenterTouchToggle = 0;
    let lastVolume = Number(volumeInput.value) || 1;
    let chapters = [];
    let segmentParts = [];
    let playIconFrame = 0;
    let playIconProgress = 0;
    let playIconTarget = null;
    let isMediaLoaded = false;
    let currentSpeed = parseSpeed(video.getAttribute("data-default-speed")) || 1;
    const volumeClasses = ["is-volume-low", "is-volume-mid", "is-volume-high"];

    const playIconShapes = {
      play: [
        [[11, 10], [18, 13.74], [18, 22.28], [11, 26]],
        [[18, 13.74], [26, 18], [26, 18], [18, 22.28]],
      ],
      pause: [
        [[11, 10], [17, 10], [17, 26], [11, 26]],
        [[20, 10], [26, 10], [26, 26], [20, 26]],
      ],
    };

    if (roundFilter && playPath) {
      const safeId = (playerId || `player-${rootIndex}`).replace(/[^a-zA-Z0-9_-]/g, "-");
      const filterId = `media-01-round-icon-${safeId}`;
      roundFilter.id = filterId;
      playPath.setAttribute("filter", `url(#${filterId})`);
    }

    previewVideo.muted = true;
    previewVideo.playsInline = true;

    function shouldUseIosSource() {
      return (
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
      );
    }

    function getMediaSource(media) {
      const source = media.getAttribute("data-src");
      const iosSource = media.getAttribute("data-ios-src");
      return shouldUseIosSource() && iosSource ? iosSource : source;
    }

    function loadMedia() {
      if (isMediaLoaded) return;
      isMediaLoaded = true;

      [
        [video, "auto"],
        [previewVideo, "metadata"],
      ].forEach(([media, preload]) => {
        const source = getMediaSource(media);
        if (source && !media.getAttribute("src")) {
          media.setAttribute("src", source);
        }
        media.preload = preload;
        if (source || media.getAttribute("src")) {
          media.load();
        }
      });

      setPlaybackSpeed(currentSpeed, { includeDefault: true });
    }

    function getDuration() {
      return Number.isFinite(video.duration) ? video.duration : 0;
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function formatTime(value) {
      if (!Number.isFinite(value)) return "0:00";
      const total = Math.max(0, Math.floor(value));
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const seconds = total % 60;
      const paddedSeconds = String(seconds).padStart(2, "0");
      if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, "0")}:${paddedSeconds}`;
      }
      return `${minutes}:${paddedSeconds}`;
    }

    function parseSpeed(value) {
      const speed = Number(value);
      return Number.isFinite(speed) && speed > 0 ? speed : null;
    }

    function formatSpeed(value) {
      return `${Number(value.toFixed(2))}x`;
    }

    function setPlaybackSpeed(speed, { includeDefault = false } = {}) {
      try {
        if (includeDefault) {
          video.defaultPlaybackRate = speed;
        }
        video.preservesPitch = true;
        video.webkitPreservesPitch = true;
      } catch {}
      video.playbackRate = speed;
    }

    function isVideoPlaying() {
      return !video.paused && !video.ended;
    }

    function isTouchInteraction(event = null) {
      return event?.pointerType === "touch" || lastPointerWasTouch;
    }

    function hideChrome({ allowInside = false, clearPreview = false } = {}) {
      if (clearPreview) {
        root.classList.remove("has-preview");
      }
      if (
        isDragging ||
        (!allowInside && isPointerOverStage) ||
        !speedMenu.hidden ||
        root.classList.contains("has-preview")
      ) {
        return;
      }
      root.classList.remove("is-chrome-visible");
    }

    function scheduleChromeHide(delay = 0, options = {}) {
      clearTimeout(chromeTimer);
      if (delay <= 0) {
        hideChrome(options);
        return;
      }
      chromeTimer = setTimeout(() => hideChrome(options), delay);
    }

    function showChrome(shouldAutoHide = false) {
      clearTimeout(chromeTimer);
      if (modal.hidden || root.classList.contains("is-closing")) return;
      root.classList.add("is-chrome-visible");
      if (shouldAutoHide && isVideoPlaying()) {
        scheduleChromeHide(4000, { allowInside: true, clearPreview: true });
      }
    }

    function showTouchChrome() {
      showChrome(false);
      scheduleChromeHide(3000, { allowInside: true, clearPreview: true });
    }

    function hideTouchChrome() {
      clearTimeout(chromeTimer);
      closeSpeedMenu();
      root.classList.remove("is-chrome-visible", "has-preview");
      clearHoveredChapter();
    }

    function beginClosingVisualState() {
      clearTimeout(chromeTimer);
      root.classList.add("is-closing");
      root.classList.remove("is-chrome-visible", "has-preview");
      clearHoveredChapter();
    }

    function easeOutQuart(progress) {
      return 1 - Math.pow(1 - progress, 4);
    }

    function getSubpath(points) {
      const lines = points
        .map((point, index) => {
          const command = index === 0 ? "M" : "L";
          return `${command} ${point[0].toFixed(2)} ${point[1].toFixed(2)}`;
        })
        .join(" ");
      return `${lines} Z`;
    }

    function renderPlayIcon(progress) {
      if (!playPath) return;
      const subpaths = playIconShapes.play.map((playPoints, pathIndex) => {
        const pausePoints = playIconShapes.pause[pathIndex];
        const points = playPoints.map((point, pointIndex) => {
          const pausePoint = pausePoints[pointIndex];
          return [
            point[0] + (pausePoint[0] - point[0]) * progress,
            point[1] + (pausePoint[1] - point[1]) * progress,
          ];
        });
        return getSubpath(points);
      });
      playPath.setAttribute("d", subpaths.join(" "));
    }

    function morphPlayIcon(isPlaying) {
      const target = isPlaying ? 1 : 0;
      if (playIconTarget === target) return;
      playIconTarget = target;
      cancelAnimationFrame(playIconFrame);

      const startProgress = playIconProgress;
      const distance = target - startProgress;
      const startTime = performance.now();
      const duration = 220;

      function step(now) {
        const elapsed = now - startTime;
        const progress = clamp(elapsed / duration, 0, 1);
        playIconProgress = startProgress + distance * easeOutQuart(progress);
        renderPlayIcon(playIconProgress);
        if (progress < 1) {
          playIconFrame = requestAnimationFrame(step);
        }
      }

      playIconFrame = requestAnimationFrame(step);
    }

    function updatePlayButtonUI() {
      const isPlaying = isVideoPlaying();
      const label = isPlaying ? "Pause video" : "Play video";
      playButton.setAttribute("aria-label", label);
      centerButton.setAttribute("aria-label", label);
      root.classList.toggle("is-playing", isPlaying);
      morphPlayIcon(isPlaying);
    }

    function triggerPulse(type) {
      pulse.classList.remove("show-play", "show-pause");
      void pulse.offsetWidth;
      pulse.classList.add(type === "pause" ? "show-pause" : "show-play");
    }

    function togglePlay({ userInitiated = true } = {}) {
      loadMedia();
      if (isVideoPlaying()) {
        video.pause();
        if (userInitiated) triggerPulse("pause");
      } else {
        video.play().catch(() => {});
        if (userInitiated) triggerPulse("play");
      }
      updatePlayButtonUI();
    }

    function updateVolumeUI() {
      const isMuted = video.muted || video.volume === 0;
      const volume = isMuted ? 0 : video.volume;
      volumeInput.value = String(volume);
      timeline.style.setProperty("--volume-percent", `${volume * 100}%`);
      root.classList.toggle("is-muted", isMuted);
      root.classList.remove(...volumeClasses);
      if (!isMuted) {
        if (volume < 0.35) root.classList.add("is-volume-low");
        else if (volume < 0.75) root.classList.add("is-volume-mid");
        else root.classList.add("is-volume-high");
      }
    }

    function toggleMute() {
      loadMedia();
      if (video.muted || video.volume === 0) {
        video.muted = false;
        video.volume = lastVolume || 1;
      } else {
        lastVolume = video.volume;
        video.muted = true;
      }
      updateVolumeUI();
    }

    function updateSpeedUI() {
      speedLabel.textContent = formatSpeed(currentSpeed);
      speedOptions.forEach((option) => {
        const optionSpeed = parseSpeed(option.getAttribute("data-speed"));
        const isActive = Math.abs((optionSpeed || 1) - currentSpeed) < 0.01;
        option.classList.toggle("is-active", isActive);
      });
    }

    function closeSpeedMenu() {
      speedMenu.hidden = true;
      speedButton.setAttribute("aria-expanded", "false");
    }

    function toggleSpeedMenu() {
      const isExpanded = speedButton.getAttribute("aria-expanded") === "true";
      speedButton.setAttribute("aria-expanded", String(!isExpanded));
      speedMenu.hidden = isExpanded;
    }

    function updateTimeUI() {
      const duration = getDuration();
      const current = clamp(video.currentTime || 0, 0, duration);
      currentTimeNode.textContent = formatTime(current);
      durationNode.textContent = formatTime(duration);
      timeline.setAttribute("aria-valuemin", "0");
      timeline.setAttribute("aria-valuemax", String(Math.round(duration)));
      timeline.setAttribute("aria-valuenow", String(Math.round(current)));
      timeline.setAttribute("aria-valuetext", formatTime(current));

      const ratio = duration > 0 ? current / duration : 0;
      timeline.style.setProperty("--scrubber-left", `${(ratio * 100).toFixed(3)}%`);

      chapters.forEach((chapter, idx) => {
        const fill = segmentParts[idx]?.fill;
        if (!fill) return;
        const start = chapter.start;
        const end = chapter.end;
        if (current >= end) {
          fill.style.setProperty("--chapter-progress", "100%");
        } else if (current <= start) {
          fill.style.setProperty("--chapter-progress", "0%");
        } else {
          const progress = (current - start) / (end - start);
          fill.style.setProperty("--chapter-progress", `${(progress * 100).toFixed(3)}%`);
        }
      });
    }

    function buildChapters() {
      const duration = getDuration();
      const rawChapters = [...root.querySelectorAll("[data-media-chapter]")].map((item) => ({
        start: Number(item.getAttribute("data-start")) || 0,
        title: item.getAttribute("data-title") || "",
      }));

      if (!rawChapters.length || rawChapters[0].start !== 0) {
        rawChapters.unshift({ start: 0, title: "Start" });
      }
      rawChapters.sort((a, b) => a.start - b.start);

      chapters = rawChapters.map((ch, idx) => {
        const next = rawChapters[idx + 1];
        const end = next ? next.start : Math.max(ch.start, duration);
        return { ...ch, end, duration: Math.max(0, end - ch.start) };
      });

      chapterTrack.innerHTML = "";
      segmentParts = chapters.map((ch) => {
        const el = document.createElement("div");
        el.className = "chapter";
        el.style.setProperty("--chapter-grow", String(ch.duration || 1));
        const fill = document.createElement("div");
        fill.className = "fill";
        el.appendChild(fill);
        chapterTrack.appendChild(el);
        return { el, fill };
      });
    }

    function getChapterAt(time) {
      return (
        chapters.find((ch) => time >= ch.start && time <= ch.end) ||
        chapters[chapters.length - 1] || { title: "" }
      );
    }

    function clearHoveredChapter() {
      segmentParts.forEach((part) => part.el.classList.remove("is-hovered"));
    }

    function updateHoveredChapter(time) {
      chapters.forEach((ch, idx) => {
        const isHovered = time >= ch.start && time <= ch.end;
        segmentParts[idx]?.el.classList.toggle("is-hovered", isHovered);
      });
    }

    function updatePreviewVideo(time) {
      cancelAnimationFrame(previewFrame);
      previewFrame = requestAnimationFrame(() => {
        if (Math.abs(previewVideo.currentTime - time) > 0.05) {
          previewVideo.currentTime = time;
        }
      });
    }

    function updatePreviewAtTime(time, percent) {
      loadMedia();
      previewCard.style.left = `${(percent * 100).toFixed(3)}%`;
      previewTimeNode.textContent = formatTime(time);
      const ch = getChapterAt(time);
      previewTitleNode.textContent = ch.title;
      previewCard.classList.toggle("has-title", Boolean(ch.title));
      updatePreviewVideo(time);
      updateHoveredChapter(time);
    }

    function updateScrubFromEvent(event) {
      const rect = timeline.getBoundingClientRect();
      const percent = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const duration = getDuration();
      const targetTime = percent * duration;
      pendingScrubTime = targetTime;
      updatePreviewAtTime(targetTime, percent);
      updateTimeUI();
    }

    function startScrubbing(event) {
      loadMedia();
      isDragging = true;
      activePointerId = event.pointerId;
      timeline.setPointerCapture?.(event.pointerId);
      resumeAfterScrub = isVideoPlaying();
      if (resumeAfterScrub) video.pause();
      root.classList.add("is-scrubbing", "has-preview");
      showChrome(false);
      updateScrubFromEvent(event);
    }

    function endScrubbing(event) {
      if (!isDragging) return;
      isDragging = false;
      if (activePointerId !== null) {
        timeline.releasePointerCapture?.(activePointerId);
        activePointerId = null;
      }
      root.classList.remove("is-scrubbing");
      if (pendingScrubTime !== null) {
        video.currentTime = pendingScrubTime;
        pendingScrubTime = null;
      }
      if (resumeAfterScrub) {
        video.play().catch(() => {});
        resumeAfterScrub = false;
      }
      updatePlayButtonUI();
      if (isTouchInteraction(event)) {
        hideTouchChrome();
      } else {
        showChrome(true);
      }
    }

    function openPlayer(trigger = null) {
      activeBeforeOpen = trigger || document.activeElement;
      loadMedia();
      modal.hidden = false;
      root.removeAttribute("hidden");
      clearTimeout(closeTimer);
      clearTimeout(closeRevealTimer);
      root.classList.remove("is-closing", "is-close-ready");
      void root.offsetWidth;
      root.classList.add("is-player-open");
      showChrome(true);
      openButtons.forEach((btn) => btn.setAttribute("aria-expanded", "true"));
      closeRevealTimer = setTimeout(() => {
        root.classList.add("is-close-ready");
      }, 260);
    }

    function closePlayer() {
      if (modal.hidden || root.classList.contains("is-closing")) return;
      video.pause();
      beginClosingVisualState();
      closeTimer = setTimeout(() => {
        modal.hidden = true;
        root.setAttribute("hidden", "");
        root.classList.remove("is-player-open", "is-closing", "is-close-ready");
        openButtons.forEach((btn) => btn.setAttribute("aria-expanded", "false"));
        if (activeBeforeOpen && typeof activeBeforeOpen.focus === "function") {
          activeBeforeOpen.focus();
        }
      }, 420);
    }

    // Event Listeners Registration
    openButtons.forEach((button) => {
      button.addEventListener("click", (e) => openPlayer(e.currentTarget), { signal });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", () => closePlayer(), { signal });
    });

    playButton.addEventListener("click", () => togglePlay({ userInitiated: true }), { signal });
    centerButton.addEventListener("click", () => togglePlay({ userInitiated: true }), { signal });
    muteButton.addEventListener("click", () => toggleMute(), { signal });

    volumeInput.addEventListener(
      "input",
      () => {
        loadMedia();
        video.muted = false;
        video.volume = Number(volumeInput.value);
        lastVolume = video.volume;
        updateVolumeUI();
      },
      { signal }
    );

    speedButton.addEventListener("click", () => toggleSpeedMenu(), { signal });

    speedOptions.forEach((option) => {
      option.addEventListener(
        "click",
        () => {
          const speed = parseSpeed(option.getAttribute("data-speed"));
          if (speed) {
            currentSpeed = speed;
            setPlaybackSpeed(speed);
            updateSpeedUI();
            closeSpeedMenu();
          }
        },
        { signal }
      );
    });

    pipButton.addEventListener("click", async () => {
      loadMedia();
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (video.requestPictureInPicture) {
          await video.requestPictureInPicture();
        }
      } catch {}
    }, { signal });

    fullscreenButton.addEventListener("click", async () => {
      loadMedia();
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (shell.requestFullscreen) {
          await shell.requestFullscreen();
        }
      } catch {}
    }, { signal });

    timeline.addEventListener("pointerdown", startScrubbing, { signal });
    timeline.addEventListener("pointermove", (e) => {
      if (isDragging) updateScrubFromEvent(e);
      else {
        const rect = timeline.getBoundingClientRect();
        const percent = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        updatePreviewAtTime(percent * getDuration(), percent);
        root.classList.add("has-preview");
      }
    }, { signal });
    timeline.addEventListener("pointerup", endScrubbing, { signal });
    timeline.addEventListener("pointercancel", endScrubbing, { signal });
    timeline.addEventListener("pointerleave", () => {
      if (!isDragging) {
        root.classList.remove("has-preview");
        clearHoveredChapter();
      }
    }, { signal });

    video.addEventListener("loadedmetadata", () => {
      buildChapters();
      updateTimeUI();
    }, { signal });

    video.addEventListener("timeupdate", () => {
      if (!isDragging) updateTimeUI();
    }, { signal });

    video.addEventListener("play", () => updatePlayButtonUI(), { signal });
    video.addEventListener("pause", () => updatePlayButtonUI(), { signal });
    video.addEventListener("ended", () => updatePlayButtonUI(), { signal });

    window.addEventListener("keydown", (e) => {
      if (modal.hidden) return;
      if (e.key === "Escape") {
        closePlayer();
      } else if (e.key === " " || e.key === "k") {
        e.preventDefault();
        togglePlay({ userInitiated: true });
      } else if (e.key === "m") {
        toggleMute();
      } else if (e.key === "f") {
        fullscreenButton.click();
      }
    }, { signal });

    stage.addEventListener("pointerenter", () => {
      isPointerOverStage = true;
      showChrome(true);
    }, { signal });

    stage.addEventListener("pointerleave", () => {
      isPointerOverStage = false;
      hideChrome({ allowInside: false });
    }, { signal });

    stage.addEventListener("pointermove", () => {
      showChrome(true);
    }, { signal });

    stage.addEventListener("click", (e) => {
      if (e.target.closest(".controls, .seek, .close")) return;
      togglePlay({ userInitiated: true });
    }, { signal });

    cleanups.set(root, () => controller.abort());
    buildChapters();
    updateTimeUI();
    updateVolumeUI();
    updateSpeedUI();
    showChrome(true);
  });
}